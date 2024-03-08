import "dotenv/config";
import { Readable } from "node:stream";
import { app } from '@azure/functions';
import askYoutubeLocal from "../local.js";
import askYoutubeAzure from "../azure.js";

async function ask(request, context) {
  const body = request.body ? await request.json() : undefined;

  try {
    // Use local or Azure implementation
    const useAzure = process.env.USE_AZURE === "true";
    const askYoutube = useAzure ? askYoutubeAzure : askYoutubeLocal;

    const chunks = await askYoutube(body?.youtubeVideoUrl, body?.question);
  
    return {
      body: createStream(chunks),
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

function createStream(chunks) {
  const buffer = new Readable();
  // We must implement the _read method, but we don't need to do anything
  buffer._read = () => {};

  const stream = async () => {
    for await (const chunk of chunks) {
      buffer.push(chunk);
    }
  
    // Signal end of stream
    buffer.push(null);
  }
    
  // Do not await to let the promise run in the background
  stream();

  return buffer;
}

app.setup({ enableHttpStream: true });
app.http('ask', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: ask
});
