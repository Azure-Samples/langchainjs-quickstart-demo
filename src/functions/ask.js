import "dotenv/config";
import { Readable } from "node:stream";
import { app } from '@azure/functions';
import askYoutubeLocal from "./lib/local.js";
import askYoutubeAzure from "./lib/azure.js";

const YOUTUBE_VIDEO_URL = "https://www.youtube.com/watch?v=FZhbJZEgKQ4";
const QUESTION = "What are the news about GPT-4 models?";

async function ask(request, context) {
  const body = request.body ? await request.json() : undefined;

  try {
    // Use local or Azure implementation
    const useAzure = process.env.USE_AZURE === "true";
    const askYoutube = useAzure ? askYoutubeAzure : askYoutubeLocal;

    const chunks = await askYoutube(
      body?.youtubeVideoUrl || YOUTUBE_VIDEO_URL,
      body?.question || QUESTION
    );
  
    return {
      body: Readable.from(chunks),
      headers: { "Content-Type": "text/plain" },
    };
  } catch (error) {
    context.error(error);

    return {
      status: 503,
      body: "Service has failed to process the request. Please try again later.",
    };
  }
}

app.setup({ enableHttpStream: true });
app.http('ask', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: ask
});
