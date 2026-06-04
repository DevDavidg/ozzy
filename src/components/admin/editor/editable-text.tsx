'use client';

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ElementType,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { cn } from '@/lib/utils';

import { useEditorOptional } from '@/components/admin/editor/editor-provider';

type EditableTextProps = {
  path: string;
  value: string;
  as?: ElementType;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
};

export const EditableText = ({
  path,
  value,
  as: Tag = 'span',
  className,
  multiline = false,
  placeholder = 'Doble click para editar',
}: EditableTextProps) => {
  const editor = useEditorOptional();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (!editor) {
    return <Tag className={className}>{value}</Tag>;
  }

  const handleDoubleClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDraft(value);
    setIsEditing(true);
  };

  const handleSave = () => {
    const nextValue = draft.trim();

    if (nextValue !== value) {
      editor.updateField(path, nextValue);
    }

    setIsEditing(false);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setDraft(value);
      setIsEditing(false);
      return;
    }

    if (!multiline && event.key === 'Enter') {
      event.preventDefault();
      handleSave();
    }
  };

  if (isEditing) {
    const sharedProps = {
      ref: inputRef as never,
      value: draft,
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setDraft(event.target.value),
      onBlur: handleSave,
      onKeyDown: handleKeyDown,
      className: cn(
        className,
        'rounded-md border-2 border-[#2563eb] bg-white/95 px-2 py-1 text-inherit shadow-lg outline-none',
      ),
      'aria-label': placeholder,
    };

    return multiline ? (
      <textarea {...sharedProps} rows={4} />
    ) : (
      <input type="text" {...sharedProps} />
    );
  }

  return (
    <Tag
      className={cn(
        className,
        'editable-text cursor-text rounded-md transition outline-none',
        'hover:outline hover:outline-2 hover:outline-dashed hover:outline-[#2563eb]/50',
      )}
      onDoubleClick={handleDoubleClick}
      title="Doble click para editar"
      suppressHydrationWarning
    >
      {value || placeholder}
    </Tag>
  );
};
