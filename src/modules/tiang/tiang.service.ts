import {db} from "@/services/db";

export const TiangService = {
    async getAll() {
        return db.tiang.findMany()
    },
    async getById(id: number) {
        return db.tiang.findUnique({where: {id}})
    },
}