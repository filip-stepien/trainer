export const ClientStatus = {
    Active: 'active',
    Paused: 'paused',
    Ended: 'ended'
} as const;

export type ClientStatus = (typeof ClientStatus)[keyof typeof ClientStatus];

export type Client = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    status: ClientStatus;
    startedAt: string;
    createdAt: string;
    updatedAt: string;
};
