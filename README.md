# 🦜️🔗 langchainjs-quickstart-demo

Discover the journey of building a generative AI application using LangChain.js and Azure.
This demo explore the development process from idea to production, using a RAG-based approach for a Q&A system based on YouTube video transcripts.

The code comes in two versions:
- The local prototype, using FAISS and Ollama with the Llama2 model
- The production version on Azure, using Azure AI Search and GPT-4-turbo

## Usage

You need [Node.js](https://nodejs.org/en) and [Ollama](https://ollama.com/download) installed to run this demo.

```bash
npm install
ollama pull llama2
```

## Running the local prototype

```bash
npm start
```

## Running the Azure version

You need to create a `.env` file with the following content:

```env
export AZURE_AISEARCH_ENDPOINT=https://<your-service-name>.search.windows.net
export AZURE_AISEARCH_KEY=<your-aisearch-key>
export AZURE_OPENAI_API_KEY=<your-openai-key>
export AZURE_OPENAI_API_ENDPOINT=<your-openai-endpoint>
export AZURE_OPENAI_API_DEPLOYMENT_NAME="gpt-4-turbo"
export AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME="text-embedding-ada-002"
```

Then run:

```bash
npm run start:azure
```
