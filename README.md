# 🦜️🔗 langchainjs-quickstart-demo

Discover the journey of building a generative AI application using LangChain.js and Azure.
This demo explore the development process from idea to production, using a RAG-based approach for a Q&A system based on YouTube video transcripts.

The code comes in two versions:
- [local prototype](src/prototype.js): uses FAISS and Ollama with LLaMa2 model for completion and all-minilm-l6-v2 for embeddings
- [Azure cloud version](src/azure.js): uses Azure AI Search and GPT-4 Turbo model for completion and text-embedding-3-large for embeddings

## Installation

You need [Node.js](https://nodejs.org/en) and [Ollama](https://ollama.com/download) installed to run this demo.

```bash
npm install --legacy-peer-deps
ollama pull llama2
ollama pull all-minilm:l6-v2
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
- `text-embedding-3-large` with a deployment name of `text-embedding-3-large`
- `gpt-4` version `0125-preview` (aka GPT-4 Turbo) with a deployment name of `gpt4-turbo`

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
AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME="text-embedding-3-large"
```

Then you can run:

```bash
npm run start:azure
```
## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
