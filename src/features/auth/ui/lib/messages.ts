import { AuthErrorCode } from '../../domain/errors';

export const AuthErrorMessages: Record<AuthErrorCode, string> = {
    [AuthErrorCode.InvalidCredentials]: 'Nieprawidłowy adres e-mail lub hasło.',
    [AuthErrorCode.EmailAlreadyInUse]: 'Konto z tym adresem e-mail już istnieje.',
    [AuthErrorCode.WeakPassword]: 'Hasło jest zbyt słabe. Wybierz silniejsze.',
    [AuthErrorCode.RateLimited]: 'Zbyt wiele prób. Spróbuj ponownie za chwilę.',
    [AuthErrorCode.Unknown]: 'Coś poszło nie tak. Spróbuj ponownie.'
};
