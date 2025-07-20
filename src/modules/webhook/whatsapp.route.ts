import {Hono} from "hono";
import {WhatsAppWebhookMessage} from "@/types/whastapp-webhook";
import {sendSuccess} from "@/lib/response";
import {getCoordinatesFromPage} from "@/services/scraper";
import {notifyRecipient} from "@/services/whatsapp-api";
import {ErrorService} from "@/modules/error";
import {GroupService} from "@/modules/group";
import path from "node:path";
import {EnvConfig} from "@/config/env.config";
import {saveFileFromUrl} from "@/services/save-file-from-url";
import {CoordinateService} from "@/modules/coordinate";

const webhookWhatsappRoute = new Hono()

webhookWhatsappRoute.post("", async (c) => {
    const payload = await c.req.json<WhatsAppWebhookMessage>()

    if (!payload.text) {
        return sendSuccess(c, {
            message: "Dilewatkan: tidak ada teks",
            data: null
        })
    }

    const group = await GroupService.getByChatId(payload.chatId)
    if (!group) {
        return sendSuccess(c, {
            message: "Dilewatkan: grup tidak terdaftar",
            data: null,
        });
    }

    const match = payload.text.match(/(?:Lokasi|Location)\s*(?:dan|and|&)\s*(?:Verifikasi|Verification)[:：]?[^\n]*/i);
    if (!match) {
        return sendSuccess(c, {
            message: "Dilewatkan: tidak mengandung 'Lokasi dan Verifikasi'",
            data: null,
        });
    }

    const lines = payload.text.split("\n");
    const rawLink = lines[1]?.trim();
    const normalizedLink = rawLink?.startsWith("http") ? rawLink : `https://${rawLink}`;

    if (!normalizedLink) {
        return sendSuccess(c, {
            message: "Dilewatkan: link tidak valid",
            data: null,
        });
    }

    const allowedHosts = ["Timemark.com", "tridatafiber.com"];

    try {
        const urlHost = new URL(normalizedLink).host.toLowerCase();
        const isAllowed = allowedHosts.some(allowed =>
            urlHost === allowed.toLowerCase() || urlHost.endsWith(`.${allowed.toLowerCase()}`)
        );

        if (!isAllowed) {
            await notifyRecipient(`Link dari domain *${urlHost}* tidak diizinkan. Silakan gunakan domain yang diperbolehkan.`, payload);
            return sendSuccess(c, {
                message: "Dilewatkan: domain tidak diizinkan",
                data: null,
            });
        }
    } catch (err) {
        await notifyRecipient("URL tidak valid. Gagal melakukan parsing link yang Anda kirim.", payload);
        return sendSuccess(c, {
            message: "Dilewatkan: URL tidak valid",
            data: null,
        });
    }

    if (!payload.mediaPath) {
        await notifyRecipient("Pesan Anda harus menyertakan gambar atau media untuk disimpan.", payload);
        return sendSuccess(c, {
            message: "Dilewatkan: tidak mengandung media",
            data: null,
        });
    }

    let coordinates;
    try {
        coordinates = await getCoordinatesFromPage(normalizedLink);
    } catch (err) {
        await notifyRecipient(`Terjadi kesalahan saat mencoba mengambil koordinat dari link:\n${normalizedLink}`, payload);
        return sendSuccess(c, {
            message: "Error: gagal mengambil koordinat dari halaman",
            data: null,
        });
    }

    if (!coordinates?.lat || !coordinates?.long) {
        await notifyRecipient(`❌ Koordinat tidak ditemukan dari link berikut:\n${normalizedLink}`, payload);

        await ErrorService.create(normalizedLink, group.id ?? 0);

        return sendSuccess(c, {
            message: "Dilewatkan: koordinat tidak ditemukan",
            data: null,
        });
    }

    const ext = path.extname(payload.mediaPath) || ".jpg";
    const fileName = `${coordinates.lat}_${coordinates.long}${ext}`;
    const safeName = payload.name.replace(/[^a-zA-Z0-9-_]/g, "_");
    const relativeFilePath = path.join(safeName, fileName);
    const mediaUrl = EnvConfig.WHATSAPP_SERVICE_URL + `/${payload.mediaPath}`;

    const {fullPath} = await saveFileFromUrl(mediaUrl, relativeFilePath);

    await CoordinateService.create(coordinates, fileName, group.id);

    const normalizedPath = fullPath.replace(/\\/g, "/");
    const imageUrl = `https://odp.tridatafiber.com/${normalizedPath}`;

    const responseText = `✅ Berhasil menyimpan lokasi dan gambar\n\n*Koordinat* : ${coordinates.lat}, ${coordinates.long}\n*Alamat* : ${coordinates.address}\n*UrlId* : ${coordinates.urlId}\n\n*Gambar* : ${imageUrl}\n\n====================`;

    await notifyRecipient(responseText, payload);
    return sendSuccess(c, {
        message: "Success save",
        data: payload,
    });
})

export default webhookWhatsappRoute