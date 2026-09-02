export const ClientErrorCode = {
    EmailAlreadyInUse: 'email_already_in_use',
    NotFound: 'not_found'
} as const;

export type ClientErrorCode = (typeof ClientErrorCode)[keyof typeof ClientErrorCode];
