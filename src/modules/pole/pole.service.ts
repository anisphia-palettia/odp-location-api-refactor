import {db} from "@/services/db";

export const PoleService = {
    async getAll() {
        return db.pole.findMany()
    },
    async getById(id: number) {
        return db.pole.findUnique({where: {id}})
    },
}