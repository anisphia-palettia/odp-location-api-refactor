export type PageInfo = {
    take: number;
    cursor: number | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}