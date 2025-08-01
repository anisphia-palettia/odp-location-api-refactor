import {db} from "@/services/db";
import {Prisma} from "@/generated/prisma";
import GroupCreateInput = Prisma.GroupCreateInput;
import GroupUpdateInput = Prisma.GroupUpdateInput;

export const GroupService = {
    async getAll() {
        return db.group.findMany({where: {show: true}, orderBy: {name: "asc"}});
    },

    async create(data: GroupCreateInput) {
        return db.group.create({data});
    },

    async findById(id: number) {
        return db.group.findFirst({where: {id}});
    },

    async findByChatId(chatId: string) {
        return db.group.findFirst({where: {chatId}});
    },

    async getByChatId(chatId: string) {
        return db.group.findUnique({where: {chatId}});
    },

    async updateById(id: number, data: GroupUpdateInput) {
        return db.group.update({
            where: {id},
            data
        })
    },

    async deleteById(id: number) {
        return db.group.delete({where: {id}});
    },

    async getSummary() {
        const acceptedCounts = await db.coordinate.groupBy({
            by: ["groupId"],
            where: {isAccepted: true},
            _count: {id: true},
        });

        const rejectedCounts = await db.coordinate.groupBy({
            by: ["groupId"],
            where: {isAccepted: false},
            _count: {id: true},
        });

        const pendingCounts = await db.coordinate.groupBy({
            by: ["groupId"],
            where: {isAccepted: null},
            _count: {id: true},
        });

        const acceptedMap = new Map(
            acceptedCounts.map((c) => [c.groupId, c._count.id])
        );
        const rejectedMap = new Map(
            rejectedCounts.map((c) => [c.groupId, c._count.id])
        );
        const pendingMap = new Map(
            pendingCounts.map((c) => [c.groupId, c._count.id])
        );

        const groups = await db.group.findMany();

        const results = groups.map((group) => ({
            id: group.id,
            name: group.name,
            chatId: group.chatId,
            totalAccepted: acceptedMap.get(group.id) ?? 0,
            totalRejected: rejectedMap.get(group.id) ?? 0,
            totalPending: pendingMap.get(group.id) ?? 0,
            totalCoordinates:
                (acceptedMap.get(group.id) ?? 0) +
                (rejectedMap.get(group.id) ?? 0) +
                (pendingMap.get(group.id) ?? 0),
        }));

        results.sort((a, b) => a.name.localeCompare(b.name));

        return results;
    },

    async getGroupCoordinatesById(
        id: number,
        {accepted}: { accepted: boolean | null }
    ) {
        return db.group.findUnique({
            where: {id},
            include: {
                coordinates: {
                    where: accepted === null ? {isAccepted: null} : {isAccepted: accepted},
                    orderBy: {photoTakenAt: "asc"},
                    include: {
                        tiang: true,
                    },
                },
            },
        });
    }

};
