export type AuthUser = {
    id: string;
    email: string;
    name: string;
};

export function getUserFirstName({ name }: Pick<AuthUser, 'name'>) {
    return name.trim().split(' ')[0] || name;
}
