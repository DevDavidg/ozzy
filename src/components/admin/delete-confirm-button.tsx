'use client';

import { useRef, useState, type ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type DeleteConfirmButtonProps = {
  action: ComponentProps<'form'>['action'];
  id: string;
  label: string;
  title: string;
  description: string;
  confirmLabel?: string;
};

export const DeleteConfirmButton = ({
  action,
  id,
  label,
  title,
  description,
  confirmLabel = 'Eliminar',
}: DeleteConfirmButtonProps) => {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleConfirm = () => {
    formRef.current?.requestSubmit();
    setOpen(false);
  };

  return (
    <>
      <Button type="button" variant="link" className="h-auto p-0 text-red-700" onClick={() => setOpen(true)}>
        {label}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={handleConfirm}>
              {confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <form ref={formRef} action={action} className="hidden">
        <input type="hidden" name="id" value={id} />
      </form>
    </>
  );
};
