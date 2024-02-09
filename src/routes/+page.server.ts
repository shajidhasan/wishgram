import { TURNSTILE_SECRET_KEY } from "$env/static/private";
import { getProcessedMessage } from "$lib/server/gemini.js";
import { record } from "$lib/server/pocketbase.js";
import { getProcessedSVGs } from "$lib/server/utils.js";
import { fail } from "@sveltejs/kit";

export const actions = {
    default: async ({ request }) => {
        const processedMessage = {
            "main": [
                {
                    "text": "Merry Christmas",
                    "highlight": false
                },
                {
                    "text": "Robert",
                    "highlight": true
                }
            ],
            "decorations": [
                "🎄",
                "🎅",
                "🎁",
                "🌟",
                "❄️",
                "☃️",
                "🔔",
                "😍",
                "🥳",
                "😄"
            ],
            "additional": "Hope Santa brings everything you wished for!"
        }
        const processedSVGs = await getProcessedSVGs(processedMessage)
        return { processedSVGs }

        const body = await request.formData()

        const token = body.get('cf-turnstile-response')
        const ip = request.headers.get('CF-Connecting-IP')

        const formData = new FormData();
        formData.append('secret', TURNSTILE_SECRET_KEY);
        formData.append('response', token as string);
        formData.append('remoteip', ip as string);

        const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
        const result = await fetch(url, {
            body: formData,
            method: 'POST',
        });
        const outcome = await result.json();
        if (outcome.success) {
            await record(body.get('message') as string, body.get('context') as string)
            try {
                const processedMessage = await getProcessedMessage(body.get('message') as string, body.get('context') as string)
                const processedSVGs = await getProcessedSVGs(processedMessage)

                return { processedSVGs }
            } catch (e) {
                return fail(500, { message: "unknown error" })
            }
        } else {
            return fail(498, { message: outcome['error-codes'][0] })
        }
    }
}