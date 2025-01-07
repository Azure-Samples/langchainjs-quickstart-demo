import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
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

  const embeddings = new OllamaEmbeddings({ model: "nomic-embed-text" });
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
    input: question,
    context: await retriever.invoke(question)
  });

  // Print the result ----------------------------------------------------------

  console.log(`Answer for the question "${question}" using "${youtubeVideoUrl}":\n`);
  for await (const chunk of stream) {
    process.stdout.write(chunk ?? "");
    yield chunk ?? "";
  }
  console.log();
}
