'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, LogIn } from 'lucide-react';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { loginAction, type LoginState } from '@/app/login/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema } from '@/lib/validators';

type LoginFormValues = z.infer<typeof loginSchema>;

const initialState: LoginState = {
  message: '',
};

export const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@ozzygist.local',
      password: 'admin12345',
    },
  });

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData();
    formData.set('email', values.email);
    formData.set('password', values.password);
    formAction(formData);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
        />
        {errors.email ? (
          <p id="email-error" className="text-sm font-semibold text-red-700">
            {errors.email.message}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'password-error' : undefined}
          {...register('password')}
        />
        {errors.password ? (
          <p id="password-error" className="text-sm font-semibold text-red-700">
            {errors.password.message}
          </p>
        ) : null}
      </div>
      {state.message ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">
          {state.message}
        </p>
      ) : null}
      <Button type="submit" disabled={isPending} className="w-full uppercase tracking-[0.2em]">
        {isPending ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            Entrando...
          </>
        ) : (
          <>
            <LogIn aria-hidden />
            Iniciar sesión
          </>
        )}
      </Button>
    </form>
  );
};
