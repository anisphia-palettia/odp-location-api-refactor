export function parseBoolean(input?: string): boolean | undefined {
    if (input === "true") return true;
    if (input === "false") return false;
    return undefined;
}