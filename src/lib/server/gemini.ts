import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"
import { GEMINI_API_KEY } from "$env/static/private"
import type { ProcessedMessage } from "$lib/types"

const MODEL_NAME = "gemini-pro"

export const getProcessedMessage = async (message: string, context: string) => {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: MODEL_NAME })

    const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    }

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
    ]

    const parts = [
        { text: "The input has a wish/message and a context. First, you'll identify ONE highlight of the message. It can be a name, or any special word. Then, you'll add an additional sentence based on the message and context. And then, you'll suggest some relevant emojis for decoration. Again, based on the message and context. Return your output in JSON format. The message is to be written on a card, so there is no need to use ending punctuation marks like period or exclamation." },
        { text: "input: message: \"happy birthday afsana\" context: \"she is my girlfriend\"" },
        { text: "output: {\"main\":[{\"text\":\"Happy Birthday\",\"highlight\":false},{\"text\":\"Afsana\",\"highlight\":true}],\"decorations\":[\"🎂\",\"❤️\",\"🍰\",\"😘\",\"🎉\",\"🎁\",\"🎈\",\"😘\",\"😄\",\"🙌🏼\"],\"additional\":\"Have the best birthday ever, my love.\"}" },
        { text: "input: message: \"get well soon, mahi\" context: \"mahi is my close friend\"" },
        { text: "output: {\"main\":[{\"text\":\"Get well soon\",\"highlight\":false},{\"text\":\"Mahi\",\"highlight\":true}],\"decorations\":[\"💐\",\"😊\",\"☀\",\"💪\",\"🙌\",\"💊\",\"😊\",\"😎\",\"🌼\",\"🤞🏼\"],\"additional\":\"I hope you feel better soon, friend.\"}" },
        { text: "input: message: \"eid mubarak to everyone\" context: \"\"" },
        { text: "output: {\"main\":[{\"text\":\"Eid Mubarak\",\"highlight\":true},{\"text\":\"to everyone\",\"highlight\":false}],\"decorations\":[\"🌙\",\"🕌\",\"✨\",\"🎉\",\"🎊\",\"🎁\",\"💐\",\"🥳\",\"😄\",\"🤲🏼\"],\"additional\":\"May this Eid bring happiness to all.\"}" },
        { text: "input: message: \"merry christmas, robert!\" context: \"\"" },
        { text: "output: {\"main\":[{\"text\":\"Merry Christmas\",\"highlight\":false},{\"text\":\"Robert\",\"highlight\":true}],\"decorations\":[\"🎄\",\"🎅\",\"🎁\",\"🌟\",\"❄️\",\"☃️\",\"🔔\",\"😍\",\"🥳\",\"😄\"],\"additional\":\"Hope Santa brings everything you wished for!\"}" },
        { text: "input: message: \"happy birthday sadman!\" context: \"sadman is a friend who is very funny, and loves kittens\"" },
        { text: "output: {\"main\":[{\"text\":\"Happy Birthday\",\"highlight\":false},{\"text\":\"Sadman\",\"highlight\":true}],\"decorations\":[\"🎂\",\"🎉\",\"🎈\",\"🎁\",\"🍰\",\"😸\",\"😻\",\"🐈\",\"😄\",\"🥳\"],\"additional\":\"May your special day be filled with laughter and cute kittens.\"}" },
        { text: `input: message: "${message}" context: "${context}"` },
        { text: "output: " },
    ]

    const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        safetySettings,
    })

    const response = result.response
    return JSON.parse(response.text()) as ProcessedMessage
}
