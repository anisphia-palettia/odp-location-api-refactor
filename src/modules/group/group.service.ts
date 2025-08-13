import {db} from "@/services/db";
import {Prisma} from "@/generated/prisma";
import GroupCreateInput = Prisma.GroupCreateInput;
import GroupUpdateInput = Prisma.GroupUpdateInput;
import {GetCoordinatesParams} from "@/modules/group/group.types";

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

    async findByChatCode(chatCode: string) {
        return db.group.findFirst({where: {chatCode}});
    },

    async getByChatCode(chatCode: string) {
        return db.group.findUnique({where: {chatCode}});
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
            chatCode: group.chatCode,
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

    async getGroupById(id: number) {
        return db.group.findUnique({
            where: {id}
        })
    },

    async getCoordinatesByGroupId(params: GetCoordinatesParams
    ) {
        const {groupId, accepted, take = 20, cursor} = params;

        const coordWhere: Prisma.CoordinateWhereInput = {
            groupId,
            ...(accepted === null ? {isAccepted: null} : {isAccepted: accepted})
        }

        const rows = await db.coordinate.findMany({
            where: coordWhere,
            orderBy: [{photoTakenAt: "asc"}, {id: "asc"}],
            take: take + 1,
            ...(cursor ? {cursor: {id: cursor}, skip: 1} : {}),
            include: {
                pole: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        })

        const prevCount = cursor
            ? await db.coordinate.count({
                where: {...coordWhere, id: {lt: cursor}},
            })
            : 0;

        const items = rows.slice(0, take);
        const hasNextPage = rows.length > take;
        const hasPreviousPage = prevCount > 0;
        const nextCursor = hasNextPage ? items[items.length - 1].id : null;

        const total = await db.coordinate.count({where: coordWhere});

        return {
            items,
            pageInfo: {take, hasNextPage, hasPreviousPage, nextCursor},
            total,
        };
    }
};
