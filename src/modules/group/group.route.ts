import {Hono} from "hono";
import {sendError, sendSuccess} from "@/lib/response";
import {GroupService} from "@/modules/group/group.service";
import zodValidate from "@/middleware/zod-validate";
import {GroupCreateBody, GroupSchema} from "@/modules/group/group.schema";
import WhatsappApi from "@/services/whatsapp-api";

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

        const chatDetail = await WhatsappApi.chat.groupByChatId(chatId)
            .then(data => data.data)
            .catch(() => null);

        if (!chatDetail) {
            return sendError(c, {
                message: "Group not found in WhatsApp",
                status: 404,
            });
        }

        const data = {
            chatId,
            name: chatDetail.name,
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

export default groupRoute