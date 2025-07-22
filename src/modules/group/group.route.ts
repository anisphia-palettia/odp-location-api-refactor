import {Hono} from "hono";
import {sendError, sendSuccess} from "@/lib/response";
import {GroupCreateBody, GroupSchema, GroupUpdateBody} from "@/modules/group/group.schema";
import {GroupService} from "./group.service"
import {zodValidate} from "@/middleware";
import {groupByChatId, groupChats} from "@/services/whatsapp-api";
import {Prisma} from "@/generated/prisma";
import GroupUpdateInput = Prisma.GroupUpdateInput;

const groupRoute = new Hono()

groupRoute.get("/", async (c) => {
    const groups = await GroupService.getAll()
    return sendSuccess(c, {
        message: "Success get all groups",
        data: groups
    })
})

groupRoute.post(
    "/",
    zodValidate("json", GroupSchema.create),
    async (c) => {
        const {chatId} = c.req.valid("json") as GroupCreateBody;

        const groupExist = await GroupService.findByChatId(chatId);

        if (groupExist) {
            return sendError(c, {
                message: "Group already exists in database",
                status: 409,
            });
        }

        const response = await groupByChatId(chatId)
            .then(data => data.data)
            .catch(() => null);

        if (!response) {
            return sendError(c, {
                message: "Group not found in WhatsApp",
                status: 404,
            });
        }

        const data = {
            chatId,
            name: response.name,
        };

        await GroupService.create(data);

        return sendSuccess(c, {
            message: "Create new group",
        });
    }
);

groupRoute.get("/summary", async (c) => {
    const groups = await GroupService.getSummary()
    return sendSuccess(c, {
        message: "Success get summary",
        data: groups
    })
})

groupRoute.get("/whatsapp-group-chats", async (c) => {
    const response = await groupChats().then(data => (data.data))
    return sendSuccess(c, {
        message: "Success get whatsapp-group-chats",
        data: response
    })
})

groupRoute.put("/:id", zodValidate("json", GroupSchema.update), async (c) => {
    const id = Number(c.req.param("id"))
    const {show} = c.req.valid("json") as GroupUpdateInput;

    const groupExist = await GroupService.findById(id);
    if (!groupExist) {
        return sendError(c, {
            message: "Group not found",
            status: 404,
        });
    }

    const data = {
        show: show,
    }

    const result = await GroupService.updateById(id, data)

    return sendSuccess(c, {
        message: "Success update group by id",
        data: result,
    })
})

groupRoute.delete("/:id", async (c) => {
    const id = Number(c.req.param("id"))
    if (isNaN(id)) {
        return sendError(c, {
            message: "Invalid group id",
            status: 400,
        });
    }

    const groupExist = await GroupService.findById(id);
    if (!groupExist) {
        return sendError(c, {
            message: "Group not found",
            status: 404,
        });
    }
    await GroupService.deleteById(id)

    return sendSuccess(c, {
        message: "Success delete group by id",
        data: groupExist
    })
})

groupRoute.get("/:id/coordinates", async (c) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
        return sendError(c, {
            message: "Invalid group id",
            status: 400,
        });
    }

    const groupExist = await GroupService.findById(id);
    if (!groupExist) {
        return sendError(c, {
            message: "Group not found",
            status: 404,
        });
    }

    const groupWithCoordinates = await GroupService.getGroupCoordinatesById(id);
    return sendSuccess(c, {
        message: "Success get group coordinates",
        data: groupWithCoordinates,
    });
});

export default groupRoute