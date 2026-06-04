import { DatabaseFallbackBanner } from '@/components/storefront/database-fallback-banner';
import { StoreFooter } from '@/components/storefront/store-footer';
import { StoreHeader } from '@/components/storefront/store-header';
import type { FooterContent, SiteData } from '@/lib/types';

type StoreShellProps = {
  data: SiteData;
  editable?: boolean;
  showFallbackBanner?: boolean;
  children: React.ReactNode;
};

const getContent = <T,>(data: SiteData, key: string) =>
  data.sections[key]?.content as T;

export const StoreShell = ({
  data,
  editable = false,
  showFallbackBanner = false,
  children,
}: StoreShellProps) => {
  const footer = getContent<FooterContent>(data, 'footer');
  const loginHref = editable ? '/admin' : '/login';
  const loginLabel = editable ? 'Editando' : 'Iniciar sesión';

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showFallbackBanner ? <DatabaseFallbackBanner /> : null}
      <StoreHeader
        settings={data.settings}
        editable={editable}
        loginHref={loginHref}
        loginLabel={loginLabel}
      />
      {children}
      <StoreFooter settings={data.settings} footer={footer} editable={editable} />
    </div>
  );
};
