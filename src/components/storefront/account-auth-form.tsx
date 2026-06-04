'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { customerLoginAction, registerAction } from '@/app/cuenta/actions';
import { initialAuthState, type AuthFormState } from '@/lib/auth-form-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, registerSchema } from '@/lib/validators';

type CustomerLoginFormProps = {
  redirectTo?: string;
};

export const CustomerLoginForm = ({ redirectTo }: CustomerLoginFormProps) => {
  const [state, formAction, isPending] = useActionState(customerLoginAction, initialAuthState);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData();
    formData.set('email', values.email);
    formData.set('password', values.password);
    if (redirectTo) {
      formData.set('redirect', redirectTo);
    }
    formAction(formData);
  });

  return (
    <AuthFormShell state={state} onSubmit={onSubmit} submitLabel="Iniciar sesión" icon={LogIn} pending={isPending}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...register('email')} />
        {errors.email ? <FieldError message={errors.email.message} /> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" autoComplete="current-password" {...register('password')} />
        {errors.password ? <FieldError message={errors.password.message} /> : null}
      </div>
      <p className="text-sm text-muted-foreground">
        ¿No tenés cuenta?{' '}
        <Link href={redirectTo ? `/cuenta/registro?redirect=${encodeURIComponent(redirectTo)}` : '/cuenta/registro'} className="font-semibold text-foreground underline-offset-2 hover:underline">
          Registrate
        </Link>
      </p>
    </AuthFormShell>
  );
};

type RegisterFormProps = {
  redirectTo?: string;
};

export const RegisterForm = ({ redirectTo }: RegisterFormProps) => {
  const [state, formAction, isPending] = useActionState(registerAction, initialAuthState);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData();
    formData.set('name', values.name);
    formData.set('email', values.email);
    formData.set('password', values.password);
    formData.set('confirmPassword', values.confirmPassword);
    if (redirectTo) {
      formData.set('redirect', redirectTo);
    }
    formAction(formData);
  });

  return (
    <AuthFormShell state={state} onSubmit={onSubmit} submitLabel="Crear cuenta" icon={UserPlus} pending={isPending}>
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" autoComplete="name" {...register('name')} />
        {errors.name ? <FieldError message={errors.name.message} /> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...register('email')} />
        {errors.email ? <FieldError message={errors.email.message} /> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" autoComplete="new-password" {...register('password')} />
        {errors.password ? <FieldError message={errors.password.message} /> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
        <Input id="confirmPassword" type="password" autoComplete="new-password" {...register('confirmPassword')} />
        {errors.confirmPassword ? <FieldError message={errors.confirmPassword.message} /> : null}
      </div>
      <p className="text-sm text-muted-foreground">
        ¿Ya tenés cuenta?{' '}
        <Link href={redirectTo ? `/cuenta/ingresar?redirect=${encodeURIComponent(redirectTo)}` : '/cuenta/ingresar'} className="font-semibold text-foreground underline-offset-2 hover:underline">
          Iniciá sesión
        </Link>
      </p>
    </AuthFormShell>
  );
};

const AuthFormShell = ({
  children,
  state,
  onSubmit,
  submitLabel,
  icon: Icon,
  pending,
}: {
  children: React.ReactNode;
  state: AuthFormState;
  onSubmit: () => void;
  submitLabel: string;
  icon: typeof LogIn;
  pending: boolean;
}) => (
  <form onSubmit={onSubmit} className="space-y-5" noValidate>
    {children}
    {state.message ? (
      <p className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-semibold text-destructive" role="alert">
        {state.message}
      </p>
    ) : null}
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="animate-spin" aria-hidden />
          Procesando...
        </>
      ) : (
        <>
          <Icon aria-hidden />
          {submitLabel}
        </>
      )}
    </Button>
  </form>
);

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="text-sm font-semibold text-red-700" role="alert">
      {message}
    </p>
  ) : null;
