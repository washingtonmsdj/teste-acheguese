import { AccountSurfaceLoading } from '@/shared/layout/account-surface-loading';

export default function MessageThreadLoading() {
  return <AccountSurfaceLoading active="messages" label="Carregando conversa" variant="thread" />;
}
