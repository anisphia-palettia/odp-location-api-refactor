import {db} from "@/services/db";
import {Prisma} from "@/generated/prisma";
import CoordinateCreateInput = Prisma.CoordinateCreateInput;
import {CoordinateUpdateBody} from "@/modules/coordinate/coordinate.schema";

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
                lat: new Prisma.Decimal(parseFloat(data.lat as string).toFixed(6)),
                lng: new Prisma.Decimal(parseFloat(data.lng as string).toFixed(6)),
                photoCode: data.photoCode,
                photoTakenAt: data.photoTakenAt,
            },
        });
    },

    async updateById(id: number, data: CoordinateUpdateBody) {
        return db.coordinate.update({
            where: {id},
            data
        })
    },

    async getCoordinatesByGroupId(
        groupId: number,
        {accepted = null}: { accepted?: boolean | null }
    ) {
        return db.coordinate.findMany({
            where: {groupId, isAccepted: accepted},
            include: {
                pole: true,
            }
        });
    },
}