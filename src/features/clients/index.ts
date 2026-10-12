export type { Client, ClientStatus as ClientStatusValue } from './domain/client';
export { ClientStatus, getClientFullName } from './domain/client';
export { ClientAvatar } from './ui/components/client-avatar';
export { ClientList } from './ui/components/client-list';
export { ClientOverview } from './ui/components/client-overview';
export { CreateClientForm } from './ui/components/create-client-form';
export { EditClientDialog } from './ui/components/edit-client-dialog';
export {
    getClientListPath,
    getClientPath,
    getNewClientPath,
    isClientSectionPath
} from './ui/lib/routes';
