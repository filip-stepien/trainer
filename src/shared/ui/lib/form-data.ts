export function toFormData(fields: Record<string, string>) {
    const formData = new FormData();

    for (const [name, value] of Object.entries(fields)) {
        formData.set(name, value);
    }

    return formData;
}
