'use client';

import { useEffect, useSyncExternalStore } from 'react';

const hasFilePayload = (event: DragEvent) =>
  Array.from(event.dataTransfer?.types ?? []).includes('Files');

let isFileDragging = false;
const listeners = new Set<() => void>();

const emit = () => {
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => isFileDragging;

const ensureDocumentListeners = () => {
  if (typeof document === 'undefined' || (document as Document & { __ozzyFileDrag?: boolean }).__ozzyFileDrag) {
    return;
  }

  (document as Document & { __ozzyFileDrag?: boolean }).__ozzyFileDrag = true;

  const handleDragOver = (event: DragEvent) => {
    if (!hasFilePayload(event)) {
      return;
    }

    event.preventDefault();

    if (!isFileDragging) {
      isFileDragging = true;
      emit();
    }
  };

  const handleDragEnd = () => {
    if (!isFileDragging) {
      return;
    }

    isFileDragging = false;
    emit();
  };

  const handleDrop = () => {
    if (!isFileDragging) {
      return;
    }

    isFileDragging = false;
    emit();
  };

  document.addEventListener('dragover', handleDragOver);
  document.addEventListener('dragend', handleDragEnd);
  document.addEventListener('drop', handleDrop);
};

/** True while the user is dragging files anywhere over the editor page. */
export const useEditorFileDrag = (enabled: boolean) => {
  useEffect(() => {
    if (enabled) {
      ensureDocumentListeners();
    }
  }, [enabled]);

  return useSyncExternalStore(
    enabled ? subscribe : () => () => undefined,
    enabled ? getSnapshot : () => false,
    () => false,
  );
};
