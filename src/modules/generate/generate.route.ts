import {Hono} from "hono";
import {sendSuccess} from "@/lib/response";
import {getMetadataFromPage} from "@/services/scraper";
import {zodValidate} from "@/middleware";
import {GenerateCreateBody, GenerateSchema} from "./generate.schema";
import {HTTPException} from "hono/http-exception";

const generateRoute = new Hono()

generateRoute.post("", zodValidate("json", GenerateSchema.create), async (c) => {
    const {urlId} = c.req.valid("json") as GenerateCreateBody;
    const response = await getMetadataFromPage(`https://timemark.com/s/${urlId}/8`);

    if (!response) {
        throw new HTTPException(400, {message: "Data tidak berhasil di temukan atau url tidak valid"});
    }
    return sendSuccess(c, {
        message: "success generate data",
        data: response
    })
})

export default generateRoute