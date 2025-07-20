import {db} from "@/services/db";
import {Prisma} from "@/generated/prisma";
import CoordinateCreateInput = Prisma.CoordinateCreateInput;

export const CoordinateService = {
    async getAll() {
        return db.coordinate.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    },
    async getById(id: number) {
        return db.coordinate.findUnique({where: {id}});
    },

    async create(data: CoordinateCreateInput, imageName: string, groupId: number) {
        return db.coordinate.create({
            data: {
                imageName,
                groupId,
                address: data.address,
                lat: data.lat,
                long: data.long,
                urlId: data.urlId,
            },
        });
    },
}