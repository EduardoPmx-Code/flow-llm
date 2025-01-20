import { createOllama } from 'ollama-ai-provider';
import { envs } from 'src/config/envs';

export class IaProvider {
  private ollamaClient: any;
  private Model: string = envs.modelIa || 'llama3';
  constructor() {
    this.ollamaClient = createOllama({
      baseURL: envs.ollamaBaseUrl || 'http://ollama:11434/api/',
    });
  }

  getOllamaClient() {
    return this.ollamaClient;
  }

  getModel() {
    const ollama = this.getOllamaClient();
    return ollama(this.Model);
  }
}
