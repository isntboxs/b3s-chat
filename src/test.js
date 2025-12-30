import { Ollama } from "ollama";

const ollama = new Ollama()

const response = await ollama.chat({
  model: 'gemini-3-pro-preview:latest',
  messages: [{ role: 'user', content: 'Why is the sky blue?' }],
})

console.log(response)