import {db} from "@/services/db";
import {Prisma} from "@/generated/prisma";
import GroupCreateInput = Prisma.GroupCreateInput;

export const GroupService = {
    async getAll() {
        return db.group.findMany()
    },

    async create(data: GroupCreateInput) {
        return db.group.create({data})
    },

    async findById(id: number) {
        return db.group.findFirst({where: {id}})
    },

    async findByChatId(chatId: string) {
        return db.group.findMany({where: {chatId}})
    },

    async getByChatId(chatId: string) {
        return db.group.findUnique({where: {chatId}})
    },

    async getSummary() {
        const coordinateCounts = await db.coordinate.groupBy({
            by: ['groupId'],
            where: {isAccepted: true, isReject: false},
            _count: {id: true},
        });

        const notAcceptedCounts = await db.coordinate.groupBy({
            by: ['groupId'],
            where: {isAccepted: false, isReject: false},
            _count: {id: true},
        });

        const coordinateMap = new Map(coordinateCounts.map(c => [c.groupId, c._count.id]));
        const notAcceptedMap = new Map(notAcceptedCounts.map(c => [c.groupId, c._count.id]));

        const groups = await db.group.findMany();

        const results = groups.map(group => ({
            id: group.id,
            name: group.name,
            chatId: group.chatId,
            totalCoordinates: coordinateMap.get(group.id) ?? 0,
            totalIsNotAccepted: notAcceptedMap.get(group.id) ?? 0,
        }));

        results.sort((a, b) => a.name.localeCompare(b.name));

        return results;
    },

    async getGroupCoordinatesById(id: number) {
        return db.group.findUnique({
            where: {id},
            include: {
                coordinates: {
                    orderBy: {photoTakenAt: "asc"},
                },
            },
        });
    },
}
