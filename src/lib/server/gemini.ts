import { GoogleGenAI } from '@google/genai'
import { GEMINI_API_KEY } from '$env/static/private'
import type { ProcessedMessage } from '$lib/types'

// Alias tracks the current flash-lite model, so retirements don't break the app
const MODEL_NAME = 'gemini-flash-lite-latest'

// OpenAPI 3.0 schema defining the expected JSON output structure.
// This is used to enable the model's structured output mode.
const responseSchema = {
	type: 'object',
	properties: {
		main: {
			type: 'array',
			description:
				'The original message, split into parts. One part should be marked for highlight.',
			items: {
				type: 'object',
				properties: {
					text: { type: 'string' },
					highlight: { type: 'boolean' }
				},
				required: ['text', 'highlight']
			}
		},
		decorations: {
			type: 'array',
			description: 'A list of relevant emojis for decoration, based on the message and context.',
			items: { type: 'string' }
		},
		additional: {
			type: 'string',
			description:
				'A creative, additional sentence based on the message and context. Should not have ending punctuation like a period.'
		}
	},
	required: ['main', 'decorations', 'additional']
}

export const getProcessedMessage = async (
	message: string,
	context: string
): Promise<ProcessedMessage> => {
	// Initialize the new GoogleGenAI client
	const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

	// A clear system instruction that tells the model its role and task.
	const systemInstruction =
		'You are an assistant that processes wishes for greeting cards. Based on a message and its context, you will: ' +
		'1. Split the message into parts, identifying one key part to highlight (like a name or special phrase). ' +
		'2. Write a creative, additional sentence that fits the message and context. ' +
		'3. Suggest a list of relevant emojis for decoration. ' +
		'The message is for a card, so avoid ending punctuation like periods or exclamation marks in the additional sentence.'

	// The user's specific input, now cleanly separated from instructions.
	const userPrompt = `Message: "${message}"\nContext: "${context}"`

	const result = await genAI.models.generateContent({
		model: MODEL_NAME,
		config: {
			systemInstruction: systemInstruction,
			responseMimeType: 'application/json',
			responseSchema: responseSchema
		},
		contents: [{ role: 'user', parts: [{ text: userPrompt }] }]
	})

	const response = result.text

	// The model is constrained to return a valid JSON string by the schema,
	// which we can now safely parse.
	if (!response) {
		// Return a ProcessedMessage with error info
		return {
			main: [{ text: 'Sorry, there was an error processing your message.', highlight: false }],
			decorations: [],
			additional: 'Could not process the message'
		}
	}
	return JSON.parse(response) as ProcessedMessage
}
