# Demo plan

## Show Ollama

- explain what ollama is
  * run `ollama` command
- `ollama list` => show installed models
  * explain we'll use all-minilm:l6-v2 for embeddings and llama2 for the model
- `ollama run llama2` => show the model
  * "How are you?"
  * It's a minimal version of ChatGPT running on your machine
  * It also provide an API that you can use in your apps
  * ctrl+d to exit

## Explain the prototype

- open `prototype.js`
  * explain the code step by step
- `npm start` to run the demo

## Update the prototype to use Azure

- replace model/db imports
  * `imp` snippet
- replace the model init sections
  * use Copilot or `newai` snippet for the AI Search part
  * explain that the models are defined in `.env` file (show the file)
- replace the embeddings part
  * `sea` snippet => first need to check if documents are already indexed
  * `add` snippet (or use Copilot) to complete the embedding part
- `npm start` to run the demo again
