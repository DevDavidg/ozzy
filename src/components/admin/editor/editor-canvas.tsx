'use client';

import { EditorProvider, useEditor } from '@/components/admin/editor/editor-provider';
import { EditorToolbar } from '@/components/admin/editor/editor-toolbar';
import { Storefront } from '@/components/storefront/storefront';
import type { SiteData } from '@/lib/types';

type EditorCanvasProps = {
  initialData: SiteData;
  userEmail: string;
};

const EditorCanvasInner = ({ userEmail }: { userEmail: string }) => {
  const { data, saveStatus } = useEditor();

  return (
    <>
      <EditorToolbar
        brandName={data.settings.brandName}
        userEmail={userEmail}
        saveStatus={saveStatus}
      />
      <div className="bg-[#0d0d0d] px-3 py-6 md:px-6">
        <div className="editor-canvas mx-auto max-w-[1400px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/50 ring-1 ring-white/5">
          <Storefront data={data} editable />
        </div>
      </div>
    </>
  );
};

export const EditorCanvas = ({ initialData, userEmail }: EditorCanvasProps) => (
  <EditorProvider initialData={initialData}>
    <EditorCanvasInner userEmail={userEmail} />
  </EditorProvider>
);
