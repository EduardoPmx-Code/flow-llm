import { Injectable } from '@nestjs/common';
import { generateText } from 'ai';
import { createOllama, ollama } from 'ollama-ai-provider';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IaProvider } from './providers/provider-is';

@Injectable()
export class AppService {
  private Model: any;
  constructor(private readonly httpService: HttpService) {
    const llamaServer = new IaProvider();
    llamaServer.getOllamaClient();
    this.Model = llamaServer.getModel();
  }
  getHello(): string {
    return 'Hello World!';
  }

  async statusServer(): Promise<any> {
    try {
      const response = await generateText({
        model: this.Model,
        prompt: 'say hello',
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async requestServerAxios() {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'http://ollama:11434/api/generate',
          {
            model: 'llama3',
            prompt: 'Why is the sky blue?',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      console.log('Respuesta de Ollama:', response.data);
    } catch (error) {
      console.error('Error al hacer la solicitud:', error);
    }
  }
}
