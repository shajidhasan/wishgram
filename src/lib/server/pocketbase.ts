import PocketBase from 'pocketbase';

const pb = new PocketBase('https://sh4jid.pockethost.io');


export const record = async (message: string, context: string) => {
    try {
        return await pb.collection('wishgram').create({ message, context });
    } catch (e) {
        console.log("Oops!")
    }
}

