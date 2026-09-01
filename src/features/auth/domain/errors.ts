export const AuthErrorCode = {
    InvalidCredentials: 'invalid_credentials',
    EmailAlreadyInUse: 'email_already_in_use',
    WeakPassword: 'weak_password',
    RateLimited: 'rate_limited',
    Unknown: 'unknown'
} as const;

export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode];
