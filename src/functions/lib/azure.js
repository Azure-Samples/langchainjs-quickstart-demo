import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { AzureChatOpenAI, AzureOpenAIEmbeddings } from "@langchain/openai";
import {
  AzureAISearchVectorStore,
  AzureAISearchQueryType,
} from "@langchain/community/vectorstores/azure_aisearch";

export default async function* askYoutube(youtubeVideoUrl, question) {
  console.log("--- Using Azure version ---");

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

  const embeddings = new AzureOpenAIEmbeddings();
  const model = new AzureChatOpenAI();
  const vectorStore = new AzureAISearchVectorStore(embeddings, {
    search: { type: AzureAISearchQueryType.SimilarityHybrid },
  });

  // Search if documents already exist for the source video
  const videoId = youtubeVideoUrl.split("v=")[1];
  const indexedDocuments = await vectorStore.similaritySearch("*", 1, {
    filterExpression: `metadata/source eq '${videoId}'`,
  });

  if (indexedDocuments.length === 0) {
    console.log("Embedding documents...");
    await vectorStore.addDocuments(documents);
  }

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
    retriever: vectorStore.asRetriever(undefined, {
      filterExpression: `metadata/source eq '${videoId}'`,
    }),
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
