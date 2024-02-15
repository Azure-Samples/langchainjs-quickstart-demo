# LangChain.js + Azure: A Generative AI App Journey

Discover the journey of building a generative AI application using LangChain.js and Azure. This talk will explore the development process from idea to production, focusing on a RAG-based approach for a Q&A system using YouTube video transcripts. We'll demonstrate the local prototype and its transition to Azure for production.

## Introduction - 5min

- Developing with Generative AI and LLMs
  * Idea > Prototype > Production

- What is LangChain.js?
  * A JavaScript library for working with LLMs
  * Provides high-level abstractions for models, vector databases, and more
  * A bridge between local and cloud-based models

## The Idea - 5min

- RAG-based API for a Q&A system from YT videos transcripts
  * Local prototype with FAISS and Ollama w/ Llama2 model
  * Production on Azure with Azure AI Search and GPT-4-turbo

- What's RAG?
  * Retrieval-Augmented Generation
  * A combination of a retriever and a generator
  * Allows for more precise and relevant answers, grounded in a set of documents

## Demo - 8min

- Showing the prototype
  * Local setup
  * Querying the model
  * Generating answers

- Switching to production with Azure
  * Update model, embeddings, and VectorDB
  * Switching the DB from AI Search to MongoDB vCore

## Conlusion - 2min

- Summary
- Next steps
  * Lead in to LangChain.js serverless AI sample (if ready)
  * Lead in to session about the JS IA Sample?
