import {Hono} from "hono";
import {sendSuccess} from "@/lib/response";
import {getMetadataFromPage} from "@/services/scraper";
import {zodValidate} from "@/middleware";
import {GenerateCreateBody, GenerateSchema} from "./generate.schema";

const generateRoute = new Hono()

generateRoute.post("", zodValidate("json", GenerateSchema.create), async (c) => {
    const {urlId} = c.req.valid("json") as GenerateCreateBody;
    console.log(`https://timemark.com/s/${urlId}/8`);
    const response = await getMetadataFromPage(`https://timemark.com/s/${urlId}/8`);

    console.log(response);
    return sendSuccess(c, {
        message: "success generate data"
    })
})

export default generateRoute