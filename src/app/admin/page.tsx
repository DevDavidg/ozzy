import { requireAdmin } from '@/lib/auth';
import { getSiteData } from '@/lib/site-data';
import { EditorCanvas } from '@/components/admin/editor/editor-canvas';

export default async function AdminPage() {
  const user = await requireAdmin();
  const data = await getSiteData();

  return (
    <main className="min-h-screen bg-[#111]">
      <EditorCanvas initialData={data} userEmail={user.email} />
    </main>
  );
}
