'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAuthStore } from '@application/store';
import { loginSchema, LoginFormData } from '../schemas/login.schema';

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  const isExpired = searchParams.get('expired') === 'true';

  const [isHrm, setIsHrm] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { login, isLoading, error, clearError } = useAuthStore();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      isHrm: true,
    },
  });

  const handleModeChange = (hrmMode: boolean) => {
    setIsHrm(hrmMode);
    form.setValue('isHrm', hrmMode);
    clearError();
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data: LoginFormData) => {
    clearError();

    const success = await login(
      {
        username: data.username.trim(),
        password: data.password,
      },
      isHrm
    );

    if (success) {
      toast.success('ເຂົ້າສູ່ລະບົບສຳເລັດແລ້ວ', {
        description: 'ຍິນດີຕ້ອນຮັບເຂົ້າສູ່ລະບົບຄຸ້ມຄອງສັນຍາ ແລະ ນິຕິກຳ EDL',
      });
      router.push(redirectUrl);
      router.refresh();
    } else {
      const currentError = useAuthStore.getState().error;
      toast.error('ເຂົ້າສູ່ລະບົບບໍ່ສຳເລັດ', {
        description: currentError || 'ກະລຸນາກວດສອບຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານຄືນໃໝ່',
      });
    }
  };

  return {
    form,
    isHrm,
    handleModeChange,
    showPassword,
    togglePasswordVisibility,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    error,
    isExpired,
  };
}
