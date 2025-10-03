# AGENTS.md

## Project Overview

This is a generative AI demo application called "Ask YouTube" that showcases building RAG (Retrieval-Augmented Generation) applications using LangChain.js and Azure services. The application allows users to ask text-based questions about YouTube videos by analyzing their transcripts.

**Key Technologies:**
- **Language:** JavaScript (ES modules)
- **Runtime:** Node.js >= 20
- **Framework:** Azure Functions v4 with HTTP streaming support (preview feature)
- **AI Framework:** LangChain.js v0.3
- **Package Manager:** npm

**Architecture:**
The project has two implementation variants:
1. **Local Prototype** (`src/local.js`): Uses Ollama (LLaMa3) for completion, nomic-embed-text for embeddings, and FAISS for vector storage
2. **Azure Cloud Version** (`src/azure.js`): Uses Azure OpenAI (GPT-4 Turbo) for completion, text-embedding-3-large for embeddings, and Azure AI Search for vector storage

Both versions can be deployed as serverless APIs using Azure Functions runtime with HTTP streaming support.

## Setup Commands

### Prerequisites Installation
Before starting, ensure you have:
- Node.js version 20 or higher
- Ollama (for local development)
- Git

### Initial Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd langchainjs-quickstart-demo

# Install dependencies
npm install

# For local development, pull required Ollama models
ollama pull llama3
ollama pull nomic-embed-text
```

### Environment Configuration

For Azure cloud version, create a `.env` file in the project root:

```bash
AZURE_AISEARCH_ENDPOINT=https://<your-service-name>.search.windows.net
AZURE_AISEARCH_KEY=<your-aisearch-key>
AZURE_OPENAI_API_KEY=<your-openai-key>
AZURE_OPENAI_API_ENDPOINT=<your-openai-endpoint>
AZURE_OPENAI_API_DEPLOYMENT_NAME="gpt-4-turbo"
AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME="text-embedding-3-large"
AZURE_OPENAI_API_VERSION="2024-02-01"
```

**Important:** The `.env` file is gitignored and should never be committed.

## Development Workflow

### Running the Application

**Local Prototype (fastest way to start):**
```bash
npm run start:local
```

**Azure Cloud Version:**
```bash
npm run start:azure
```

**API Server (Azure Functions runtime):**
```bash
# Local version (default)
npm start

# Azure version
USE_AZURE=true npm start
```

### Testing the API

Once the server is running (default port: 7071), test with curl:

```bash
# Basic request
curl http://localhost:7071/api/ask \
  -H 'Content-Type: application/json' \
  -d '{ "question": "Will GPT-4 Turbo be available on Azure?" }'

# With streaming output (add -N flag)
curl -N http://localhost:7071/api/ask \
  -H 'Content-Type: application/json' \
  -d '{ "question": "What are the news about GPT-4 models?" }'
```

### Hot Reload / Watch Mode

The Azure Functions runtime automatically reloads when files change. No additional watch commands needed.

## Project Structure

```
├── src/
│   ├── local.js              # Local prototype using Ollama + FAISS
│   ├── azure.js              # Azure version using Azure OpenAI + AI Search
│   └── functions/
│       ├── ask.js            # Azure Functions HTTP trigger
│       └── lib/
│           ├── local.js      # Local RAG chain logic
│           └── azure.js      # Azure RAG chain logic
├── docs/                     # Extended documentation
├── package.json              # Dependencies and scripts
├── host.json                 # Azure Functions configuration
├── local.settings.json       # Local Functions settings
└── api.http                  # Sample HTTP requests
```

## Code Style Guidelines

### General Conventions
- **Module System:** ES modules (`import`/`export`)
- **Indentation:** 2 spaces (enforced by `.editorconfig`)
- **Line Endings:** LF (Unix-style)
- **Character Encoding:** UTF-8
- **Final Newline:** Always include

### JavaScript Patterns
- Use `const` and `let`, avoid `var`
- Use async/await for asynchronous operations
- Import from specific LangChain packages (e.g., `@langchain/openai`, `@langchain/community`)
- Import dotenv config at the top: `import "dotenv/config"`

### File Organization
- Keep RAG logic minimal and focused
- Separate local and Azure implementations clearly
- Azure Functions handlers in `src/functions/`
- Shared chain logic in `src/functions/lib/`

### LangChain.js Patterns
- Use `RecursiveCharacterTextSplitter` with `chunkSize: 1500` and `chunkOverlap: 200`
- Use `createStuffDocumentsChain` for document combination
- Use `ChatPromptTemplate.fromMessages` for prompt construction
- Standard retriever pattern: `vectorStore.asRetriever()`

## Testing Instructions

**Note:** This project currently has no automated test suite. Manual testing is required.

### Manual Testing Steps

1. **Test Local Version:**
   ```bash
   npm run start:local
   ```
   Verify:
   - Documents load from YouTube
   - Text splitting completes
   - Embeddings are generated
   - Vector store is populated
   - Question answering produces relevant results

2. **Test Azure Version:**
   ```bash
   npm run start:azure
   ```
   Verify:
   - Azure OpenAI connection works
   - Azure AI Search connection works
   - Document deduplication check functions
   - Embeddings are stored in Azure AI Search
   - Retrieval and generation work correctly

3. **Test API Endpoint:**
   ```bash
   # Terminal 1: Start server
   npm start
   
   # Terminal 2: Test endpoint
   curl -N http://localhost:7071/api/ask \
     -H 'Content-Type: application/json' \
     -d '{ "question": "test question" }'
   ```
   Verify:
   - Server starts on port 7071
   - HTTP streaming works (responses stream back)
   - Both local and Azure modes work with `USE_AZURE` flag

## Build and Deployment

### No Build Step Required
This project runs directly from source - no compilation or bundling needed.

### Deployment to Azure

This project is designed to deploy to Azure Functions:

1. Ensure Azure resources are created:
   - Azure OpenAI with deployed models (gpt-4-turbo, text-embedding-3-large)
   - Azure AI Search instance
   - Azure Functions app (Node.js 20 runtime)

2. Configure application settings in Azure Functions with the environment variables from `.env`

3. Deploy using Azure Functions Core Tools:
   ```bash
   func azure functionapp publish <YOUR_FUNCTION_APP_NAME>
   ```

### Azure Resources Required
- **Azure OpenAI:** Deploy `gpt-4` version `0125-preview` (GPT-4 Turbo) with deployment name `gpt-4-turbo`
- **Azure OpenAI:** Deploy `text-embedding-3-large` with deployment name `text-embedding-3-large`
- **Azure AI Search:** Any tier (free tier available)

## Dependencies Management

### Installing New Packages
```bash
npm install <package-name>
```

### Key Dependencies
- `@azure/functions` - Azure Functions runtime
- `@azure/search-documents` - Azure AI Search SDK
- `@langchain/community` - LangChain community integrations
- `@langchain/ollama` - Ollama integration for local development
- `@langchain/openai` - Azure OpenAI integration
- `langchain` - Core LangChain.js library
- `youtube-transcript` - YouTube transcript fetching
- `faiss-node` - FAISS vector store for local development
- `dotenv` - Environment variable management

## Pull Request Guidelines

### Before Submitting
1. Test both local and Azure versions manually
2. Verify no secrets are committed (check `.env` is in `.gitignore`)
3. Ensure code follows the established patterns
4. Update documentation if adding new features

### PR Title Format
Use clear, descriptive titles:
- `Add feature: [description]`
- `Fix: [description]`
- `Update: [description]`

### CLA Requirement
All contributors must agree to the Microsoft Contributor License Agreement (CLA). A bot will automatically check PRs.

## Common Issues and Troubleshooting

### Local Development Issues

**Ollama Connection Errors:**
- Ensure Ollama is running: `ollama list`
- Verify models are downloaded: `ollama pull llama3` and `ollama pull nomic-embed-text`

**Module Import Errors:**
- Ensure Node.js version >= 20
- Run `npm install` to ensure all dependencies are installed
- Check that `"type": "module"` is in package.json

### Azure Version Issues

**Authentication Errors:**
- Verify `.env` file exists and contains correct values
- Check Azure OpenAI API key and endpoint are valid
- Ensure Azure AI Search key and endpoint are correct

**Model Not Found:**
- Verify model deployment names match exactly in `.env`
- Check models are deployed in Azure AI Studio
- Verify API version is compatible: `2024-02-01`

**Vector Store Errors:**
- Ensure Azure AI Search instance is running
- Check network connectivity to Azure services
- Verify API keys have correct permissions

### Azure Functions Issues

**Port Already in Use:**
- Default port is 7071
- Stop other instances: `pkill -f "func start"` or `killall node`

**HTTP Streaming Not Working:**
- This feature is in preview - ensure Functions runtime is updated
- Check `host.json` configuration is correct

## Additional Context

### RAG Pipeline Overview
1. **Document Loading:** Fetch YouTube transcript using `YoutubeLoader`
2. **Text Splitting:** Split into chunks (1500 chars, 200 overlap)
3. **Embedding:** Generate vector embeddings for each chunk
4. **Vector Storage:** Store in FAISS (local) or Azure AI Search (cloud)
5. **Retrieval:** Find relevant chunks based on user question
6. **Generation:** Use LLM to generate answer from retrieved context

### Code Evolution Path
The demo showcases three development stages:
1. **Local Prototype** - Quick experimentation with Ollama/FAISS
2. **Azure Cloud** - Production-ready with Azure services
3. **API Deployment** - Serverless HTTP API with streaming

The core logic remains nearly identical between versions - only the model and vector store implementations change.

### Performance Considerations
- Local version is faster to start but limited by local compute
- Azure version requires network calls but scales better
- HTTP streaming provides better UX for long responses
- Document deduplication in Azure version prevents redundant indexing

### Security Notes
- Never commit `.env` files or secrets
- Use Azure Key Vault for production secret management
- Rotate API keys regularly
- Enable Azure OpenAI content filtering in production
