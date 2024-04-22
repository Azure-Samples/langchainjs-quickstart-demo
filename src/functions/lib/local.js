import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { YoutubeLoader } from "langchain/document_loaders/web/youtube";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { FaissStore } from "@langchain/community/vectorstores/faiss";

export default async function* askYoutube(youtubeVideoUrl, question) {
  console.log("--- Using local version ---");

  // Load documents ------------------------------------------------------------

  console.log("Loading documents...");

  const loader = YoutubeLoader.createFromUrl(youtubeVideoUrl, {
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
  const combineDocsChain = await createStuffDocumentsChain({
    prompt: questionAnsweringPrompt,
    llm: model,
  });
  const chain = await createRetrievalChain({
    retriever: vectorStore.asRetriever(),
    combineDocsChain,
  });
  const stream = await chain.stream({ input: question });

  // Print the result ----------------------------------------------------------

  console.log(`Answer for the question "${question}" using "${youtubeVideoUrl}":\n`);
  for await (const chunk of stream) {
    process.stdout.write(chunk.answer ?? "");
    if (chunk.answer)
      yield chunk.answer;
  }
  console.log();
}
