import { AppError } from './app-error';

export class BadRequestError extends AppError {
  constructor(message: string = 'ຂໍ້ມູນທີ່ສົ່ງມາບໍ່ຖືກຕ້ອງ (Bad Request)', details?: unknown) {
    super(message, 400, 'BAD_REQUEST', details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່ອີກຄັ້ງ (Unauthorized)', details?: unknown) {
    super(message, 401, 'UNAUTHORIZED', details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'ທ່ານບໍ່ມີສິດເຂົ້າເຖິງຂໍ້ມູນ ຫຼື ດຳເນີນການນີ້ (Forbidden)', details?: unknown) {
    super(message, 403, 'FORBIDDEN', details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'ບໍ່ພົບຂໍ້ມູນທີ່ຕ້ອງການ (Not Found)', details?: unknown) {
    super(message, 404, 'NOT_FOUND', details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'ຂໍ້ມູນຊ້ຳຊ້ອນໃນລະບົບ (Conflict)', details?: unknown) {
    super(message, 409, 'CONFLICT', details);
  }
}

export class ValidationError extends AppError {
  public readonly validationErrors?: Record<string, string[]>;

  constructor(
    message: string = 'ການກວດສອບຂໍ້ມູນບໍ່ຜ່ານ (Validation Failed)',
    validationErrors?: Record<string, string[]>
  ) {
    super(message, 422, 'VALIDATION_ERROR', validationErrors);
    this.validationErrors = validationErrors;
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'ເກີດຂໍ້ຜິດພາດຈາກລະບົບເຊີບເວີ (Internal Server Error)', details?: unknown) {
    super(message, 500, 'INTERNAL_SERVER_ERROR', details);
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີບເວີໄດ້ ກະລຸນາກວດສອບອິນເຕີເນັດ (Network Error)', details?: unknown) {
    super(message, 0, 'NETWORK_ERROR', details);
  }
}

export class TimeoutError extends AppError {
  constructor(message: string = 'ການເຊື່ອມຕໍ່ໝົດເວລາ (Request Timeout)', details?: unknown) {
    super(message, 408, 'TIMEOUT_ERROR', details);
  }
}
