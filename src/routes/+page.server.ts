import { getProcessedMessage } from "$lib/server/gemini.js";
import { record } from "$lib/server/pocketbase.js";
import { fail } from "@sveltejs/kit";

export const actions = {
    default: async ({ request }) => {
        const body = await request.formData()
        await record(body.get('message') as string, body.get('context') as string)
        try {
            const processedMessage = await getProcessedMessage(body.get('message') as string, body.get('context') as string)
            if (!processedMessage || !processedMessage.main) {
                return fail(400, { message: 'invalid message' })
            }
            return { processedMessage: { ...processedMessage, date: body.get('date') } }
        } catch (e) {
            return fail(500, { message: 'API limit reached, please try again in a minute' })
        }
    }
}