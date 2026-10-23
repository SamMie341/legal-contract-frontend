import axios, { AxiosError } from 'axios';
import { AppError } from './app-error';
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  InternalServerError,
  NetworkError,
  TimeoutError,
} from './http-errors';

interface NestErrorPayload {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}

/**
 * Normalizes any error into a standardized AppError
 */
export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<NestErrorPayload>;

    // Network or Timeout error
    if (axiosError.code === 'ECONNABORTED' || axiosError.message.includes('timeout')) {
      return new TimeoutError('ການເຊື່ອມຕໍ່ໝົດເວລາ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ');
    }

    if (!axiosError.response) {
      return new NetworkError('ບໍ່ສາມາດຕິດຕໍ່ກັບເຊີບເວີໄດ້ ກະລຸນາກວດສອບການເຊື່ອມຕໍ່');
    }

    const { status, data } = axiosError.response;
    let message = 'ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຄາດຄິດ';

    if (data) {
      if (Array.isArray(data.message)) {
        // Validation errors array from NestJS class-validator
        message = data.message.join(', ');
      } else if (typeof data.message === 'string') {
        message = data.message;
      } else if (data.error) {
        message = data.error;
      }
    }

    switch (status) {
      case 400:
        return new BadRequestError(message, data);
      case 401:
        return new UnauthorizedError(message, data);
      case 403:
        return new ForbiddenError(message, data);
      case 404:
        return new NotFoundError(message, data);
      case 409:
        return new ConflictError(message, data);
      case 422:
        return new ValidationError(message, data as Record<string, string[]>);
      case 500:
      default:
        return new InternalServerError(message, data);
    }
  }

  if (error instanceof Error) {
    return new AppError(error.message, 500, 'GENERIC_ERROR', { originalError: error.name });
  }

  return new AppError('ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຮູ້ຈັກ (Unknown error occurred)', 500, 'UNKNOWN_ERROR', error);
}

/**
 * Helper to extract user-friendly error message from any error
 */
export function getErrorMessage(error: unknown): string {
  const normalized = normalizeError(error);
  return normalized.message;
}
