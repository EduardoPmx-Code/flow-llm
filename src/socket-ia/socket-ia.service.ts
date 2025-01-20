import { Injectable } from '@nestjs/common';
import { CreateSocketIaDto } from './dto/create-socket-ia.dto';
import { UpdateSocketIaDto } from './dto/update-socket-ia.dto';

import { generateObject, generateText } from 'ai';
import { ollama, createOllama } from 'ollama-ai-provider';
import { z } from 'zod';
import { LayersIaService } from 'src/layers-ia/layers-ia.service';
import { IaProvider } from 'src/providers/provider-is';

@Injectable()
export class SocketIaService {
  private Model: any;
  systemRol = `Tu rol es el de asistente, y debes realizar las siguientes tareas:

        1. **Identificar el Idioma**:
           - Determina el idioma en el que el cliente desea comunicarse y ajusta tus respuestas en consecuencia.

        2. **Establecer la Acción del Cliente**:
           - Analiza el prompt del cliente para identificar la acción que desea realizar. Tienes tres posibles acciones:

        3. **Opciones de Acción**:
           - **Hablar**:
             - Si el cliente está solicitando una conversación o información sobre el proyecto, asigna el action_name como "talk".
             - Ejemplos de prompts: "Cuéntame sobre el proyecto", "Háblame de tus servicios".

           - **Agendar una Cita**:
             - Si el cliente está interesado en agendar una cita, asigna el action_name como "set_meet".
             - Ejemplos de prompts: "Quiero agendar una cita", "¿Cuándo podemos reunirnos?".

           - **Buscar Productos**:
             - Si el cliente desea buscar o comprar productos, asigna el action_name como "search_products".
             - Ejemplos de prompts: "Quiero buscar productos", "Necesito comprar algo".

        4. **Formato de Respuesta**:
           - Asegúrate de que la respuesta siga el formato especificado:
            
             {
               action: {
                 action_name: "..."
              }
            

        5. **Responder en el Idioma Requerido**:
           - Asegúrate de que todas tus respuestas estén en el idioma solicitado por el cliente.

        Ten en cuenta estos puntos al analizar el prompt y generar la respuesta adecuada.`;
  constructor(private layerIaService: LayersIaService) {
    const llamaServer = new IaProvider();
    llamaServer.getOllamaClient();
    this.Model = llamaServer.getModel();
  }
  async generateResponse(prompt: string): Promise<any> {
    try {
      const model = this.Model;
      const response = await generateObject({
        model: model,
        system: this.systemRol,
        temperature: 0,
        maxTokens: 50,
        schema: z.object({
          action: z
            .object({
              action_name: z.string(),
            })
            .nullable(),
        }),
        prompt: prompt,
      });
      console.log(response);
      if (response.object.action.action_name === 'tall')
        console.log('capa para hablar');
      if (response.object.action.action_name === 'set_meet')
        console.log('capa para agendar');
      if (response.object.action.action_name === 'search_products')
        return await this.layerIaService.handlerProducts(prompt);
      console.log('capa para buscar productos');
      return response.object.action;
    } catch (error) {
      // ,,,,,,
      console.error('Error generating response:', error);
      return 'Sorry, something went wrong.';
    }
  }
}
