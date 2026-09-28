import { ClientErrorCode } from '../../domain/errors';

export const ClientErrorMessages: Record<ClientErrorCode, string> = {
    [ClientErrorCode.EmailAlreadyInUse]: 'Podopieczny z tym adresem e-mail już istnieje.',
    [ClientErrorCode.NotFound]: 'Nie znaleziono podopiecznego.'
};

export const ClientActionMessages = {
    CreateFailed: 'Nie udało się dodać podopiecznego.',
    Saved: 'Dane podopiecznego zostały zapisane.'
} as const;
