'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { toast } from 'sonner';

import { patchEditorFieldAction } from '@/app/admin/editor-actions';
import { uploadImageClient } from '@/lib/upload-image-client';
import { applyPathToSiteData } from '@/lib/editor-paths';
import type { SiteData } from '@/lib/types';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

type EditorContextValue = {
  data: SiteData;
  isEditing: true;
  saveStatus: SaveStatus;
  updateField: (path: string, value: string | number) => void;
  uploadImage: (path: string, file: File) => Promise<void>;
};

const EditorContext = createContext<EditorContextValue | null>(null);

export const useEditor = () => {
  const context = useContext(EditorContext);

  if (!context) {
    throw new Error('useEditor must be used within EditorProvider');
  }

  return context;
};

export const useEditorOptional = () => useContext(EditorContext);

type EditorProviderProps = {
  initialData: SiteData;
  children: ReactNode;
};

export const EditorProvider = ({ initialData, children }: EditorProviderProps) => {
  const [data, setData] = useState(initialData);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const dataRef = useRef(data);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const prevSaveStatusRef = useRef<SaveStatus>('idle');

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    if (prevSaveStatusRef.current === 'saving' && saveStatus === 'saved') {
      toast.success('Cambios guardados');
    }

    if (prevSaveStatusRef.current === 'saving' && saveStatus === 'error') {
      toast.error('Error al guardar');
    }

    prevSaveStatusRef.current = saveStatus;
  }, [saveStatus]);

  const persistField = useCallback(async (path: string, value: string | number) => {
    setSaveStatus('saving');
    const result = await patchEditorFieldAction(path, value);

    setSaveStatus(result.ok ? 'saved' : 'error');
  }, []);

  const updateField = useCallback(
    (path: string, value: string | number) => {
      setData((current) => applyPathToSiteData(current, path, value));
      setSaveStatus('saving');

      const existingTimer = timersRef.current.get(path);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      const timer = setTimeout(() => {
        void persistField(path, value);
        timersRef.current.delete(path);
      }, 450);

      timersRef.current.set(path, timer);
    },
    [persistField],
  );

  const uploadImage = useCallback(
    async (path: string, file: File) => {
      setSaveStatus('saving');
      const result = await uploadImageClient(file);

      if (!result.ok || !result.url) {
        setSaveStatus('error');
        toast.error(result.message ?? 'Error al subir imagen');
        return;
      }

      setData((current) => applyPathToSiteData(current, path, result.url!));
      await persistField(path, result.url);
      toast.success('Imagen actualizada');
    },
    [persistField],
  );

  const value = useMemo<EditorContextValue>(
    () => ({
      data,
      isEditing: true,
      saveStatus,
      updateField,
      uploadImage,
    }),
    [data, saveStatus, updateField, uploadImage],
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};
