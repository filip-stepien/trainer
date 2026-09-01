function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export const env = {
    get supabaseUrl() {
        return requireEnv('NEXT_PUBLIC_SUPABASE_URL');
    },
    get supabaseAnonKey() {
        return requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }
};
