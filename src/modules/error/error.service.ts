import {db} from "@/services/db";

export const ErrorService = {
    async create(url: string, groupId: number) {
        return db.error.create({
            data: {
                url,
                groupId,
            },
        });
    },

    async update(isDone: boolean, id: number) {
        return db.error.update({
            where: {id},
            data: {
                done: isDone,
            },
        });
    },
}
