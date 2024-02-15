# 🦜️🔗 langchainjs-quickstart-demo

Discover the journey of building a generative AI application using LangChain.js and Azure.
This demo explore the development process from idea to production, using a RAG-based approach for a Q&A system based on YouTube video transcripts.

The code comes in two versions:
- The [local prototype](prototype.js), using FAISS and Ollama with the Llama2 model
- The [production version](azure.js), using Azure AI Search and GPT-4-turbo

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

To run the Azure version, you need to have an Azure account and a subscription enabled for Azure OpenAI usage. If you don't have an Azure account, you can create a [free account](https://azure.microsoft.com/free/) to get started.

For Azure OpenAI, you can [request access with this form](https://aka.ms/oaiapply).

### Create the Azure resources

First you need to create an Azure OpenAI instance. You can deploy a version on Azure Portal following [this guide](https://learn.microsoft.com/azure/ai-services/openai/how-to/create-resource?pivots=web-portal).

In Azure AI Studio, you'll need to deploy these two models:
- `text-embedding-ada-002` with a deployment name of `text-embedding-ada-002`
- `gpt-4` version `1106-preview` (aka GPT-4 Turbo) with a deployment name of `gpt4-turbo`

> **Note**: GPT-4 Turbo is currently in preview and may not be available in all regions, see [this table](https://learn.microsoft.com/azure/ai-services/openai/concepts/models#gpt-4-and-gpt-4-turbo-preview-models) for region availability.

You'll also need to have an Azure AI Search instance running. You can deploy a free version on Azure Portal without any cost, following [this guide](https://learn.microsoft.com/azure/search/search-create-service-portal).

### Set up the environment

You need to create a `.env` file with the following content:

```bash
AZURE_AISEARCH_ENDPOINT=https://<your-service-name>.search.windows.net
AZURE_AISEARCH_KEY=<your-aisearch-key>
AZURE_OPENAI_API_KEY=<your-openai-key>
AZURE_OPENAI_API_ENDPOINT=<your-openai-endpoint>
AZURE_OPENAI_API_DEPLOYMENT_NAME="gpt4-turbo"
AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME="text-embedding-ada-002"
```

Then run:

```bash
npm run start:azure
```
