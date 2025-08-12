import {Hono} from "hono";
import {sendError, sendSuccess} from "@/lib/response";
import {GroupCreateBody, GroupSchema} from "@/modules/group/group.schema";
import {GroupService} from "./group.service"
import {zodValidate} from "@/middleware";
import {groupByChatId, groupChats} from "@/services/whatsapp-api";
import {Prisma} from "@/generated/prisma";
import GroupUpdateInput = Prisma.GroupUpdateInput;
import {parseBoolean} from "@/helper/parse-boolean";
import {CoordinateService} from "@/modules/coordinate";
import {HTTPException} from "hono/http-exception";

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
        const {chatCode} = c.req.valid("json") as GroupCreateBody;

        const groupExist = await GroupService.findByChatCode(chatCode);

        if (groupExist) {
            await GroupService.updateById(groupExist.id, {show: true})
            return sendSuccess(c, {
                message: "Success update group",
                status: 200,
            });
        }

        const response = await groupByChatId(chatCode)
            .then(data => data.data)
            .catch(() => null);

        if (!response) {
            return sendError(c, {
                message: "Group not found in WhatsApp",
                status: 404,
            });
        }

        const data = {
            chatCode,
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
    const groups = await GroupService.getAll()
    const response = await groupChats().then(data => data.data);
    const existingChatIds = new Set(groups.map(g => g.chatCode));
    const filteredGroups = response?.filter(g => !existingChatIds.has(g.id));

    return sendSuccess(c, {
        message: "Success get whatsapp-group-chats",
        data: filteredGroups
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
    await GroupService.updateById(id, {
        show: false
    })

    return sendSuccess(c, {
        message: "Success delete group by id",
        data: groupExist
    })
})

groupRoute.get("/:id", async (c) => {
    const id = c.req.param("id")
    const group = await GroupService.getGroupById(Number(id))
    if (!group) {
        throw new HTTPException(404, {message: "Group not found"})
    }
    return sendSuccess(c, {
        message: "Success get the group",
        data: group
    })
})

groupRoute.get("/:id/coordinates", async (c) => {
    const {accepted} = c.req.query();
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
        return sendError(c, {
            message: "Invalid group id",
            status: 400,
        });
    }

    let parsedAccepted: boolean | null = null;

    if (accepted !== undefined) {
        const parsed = parseBoolean(accepted);
        if (parsed === undefined) {
            return sendError(c, {
                message: "Invalid 'accepted' value. Must be 'true' or 'false'.",
                status: 400,
            });
        }
        parsedAccepted = parsed;
    }

    const groupExist = await GroupService.findById(id);
    if (!groupExist) {
        return sendError(c, {
            message: "Group not found",
            status: 404,
        });
    }

    const groupWithCoordinates = await CoordinateService.getCoordinatesByGroupId(id, {
        accepted: parsedAccepted,
    });

    return sendSuccess(c, {
        message: "Success get group coordinates",
        data: groupWithCoordinates,
    });
});


export default groupRoute