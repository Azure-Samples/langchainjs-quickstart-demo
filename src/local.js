import "dotenv/config";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { FaissStore } from "@langchain/community/vectorstores/faiss";

const YOUTUBE_VIDEO_URL = "https://www.youtube.com/watch?v=FZhbJZEgKQ4";
const QUESTION = "What are the news about GPT-4 models?";

// Load documents ------------------------------------------------------------

console.log("Loading documents...");

const loader = YoutubeLoader.createFromUrl(YOUTUBE_VIDEO_URL, {
  language: "en",
  addVideoInfo: true,
});
const rawDocuments = await loader.load();
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1500,
  chunkOverlap: 200,
});
const documents = await splitter.splitDocuments(rawDocuments);

// Init models and DB --------------------------------------------------------

console.log("Initializing models and DB...");

const embeddings = new OllamaEmbeddings({ model: "all-minilm:l6-v2" });
const model = new ChatOllama({ model: "llama3" });
const vectorStore = new FaissStore(embeddings, {});

console.log("Embedding documents...");
await vectorStore.addDocuments(documents);

// Run the chain -------------------------------------------------------------

console.log("Running the chain...");

const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
  ["system", "Answer the user's question using only the sources below:\n\n{context}"],
  ["human", "{input}"],
]);
const retriever = vectorStore.asRetriever()
const ragChain = await createStuffDocumentsChain({
  prompt: questionAnsweringPrompt,
  llm: model,
});
const stream = await ragChain.stream({
  input: QUESTION,
  context: await retriever.invoke(QUESTION)
});

// Print the result ----------------------------------------------------------

console.log(`Answer for the question "${QUESTION}":\n`);
for await (const chunk of stream) {
  process.stdout.write(chunk ?? "");
}
console.log();
