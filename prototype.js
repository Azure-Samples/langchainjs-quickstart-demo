import fs from "node:fs";
import 'dotenv/config';
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { YoutubeLoader } from "langchain/document_loaders/web/youtube";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { FaissStore } from "@langchain/community/vectorstores/faiss";

// Load documents ------------------------------------------------------------

console.log("Loading documents...");

const loader = YoutubeLoader.createFromUrl("https://www.youtube.com/watch?v=FZhbJZEgKQ4", {
  language: "en",
  addVideoInfo: true,
});
const rawDocuments = await loader.load();
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
const documents = await splitter.splitDocuments(rawDocuments);

// Init models and DB --------------------------------------------------------

console.log("Initializing models and DB...");

const embeddings = new OllamaEmbeddings({ model: "llama2" });
const model = new ChatOllama({ model: "llama2" });

const faissFolder = "faiss_store";
let vectorStore;

if (!fs.existsSync(faissFolder)) {
  console.log("Embedding documents...");
  vectorStore = await FaissStore.fromDocuments(documents, embeddings);
  vectorStore.save("faiss_store");
} else {
 vectorStore = await FaissStore.load("faiss_store", embeddings);
}

// Run the chain -------------------------------------------------------------

console.log("Running the chain...");

const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Answer the user's questions based on the below context:\n\n{context}",
  ],
  [
    "human",
    "{input}"
  ],
]);
const combineDocsChain = await createStuffDocumentsChain({
  llm: model,
  prompt: questionAnsweringPrompt,
});
const chain = await createRetrievalChain({
  retriever: vectorStore.asRetriever(),
  combineDocsChain,
});
const stream = await chain.stream({
  input: "What can you do with the new Copilot announcement?",
});

// Print the result ----------------------------------------------------------

console.log(`Result:\n`);
for await (const chunk of stream) {
  process.stdout.write(chunk.answer ?? '');
}
console.log();
