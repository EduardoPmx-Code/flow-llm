import { Injectable } from '@nestjs/common';
import { generateObject, generateText } from 'ai';
import { ollama, createOllama } from 'ollama-ai-provider';
import { IaProvider } from 'src/providers/provider-is';
import { z } from 'zod';
@Injectable()
export class ProductsLayerIaService {
  private Model: any;
  private systemHandler: string;
  private systemRolProducts: string;
  db_products = [
    {
      id: 7,
      name: 'Audífonos',
      price: 50,
      available: true,
      createAt: '2024-02-27T15:50:48.406Z',
      updateAt: '2024-02-27T15:50:48.406Z',
    },
    {
      id: 9,
      name: 'Smartphone',
      price: 800,
      available: true,
      createAt: '2024-02-27T15:50:58.406Z',
      updateAt: '2024-02-27T15:50:58.406Z',
    },
    {
      id: 11,
      name: 'Impresora',
      price: 200,
      available: true,
      createAt: '2024-02-27T15:51:08.123Z',
      updateAt: '2024-02-27T15:51:08.123Z',
    },
    {
      id: 12,
      name: 'Altavoces',
      price: 150,
      available: true,
      createAt: '2024-02-27T15:51:13.021Z',
      updateAt: '2024-02-27T15:51:13.021Z',
    },
    {
      id: 13,
      name: 'Cámara',
      price: 400,
      available: true,
      createAt: '2024-02-27T15:51:17.943Z',
      updateAt: '2024-02-27T15:51:17.943Z',
    },
    {
      id: 14,
      name: 'Televisor',
      price: 700,
      available: true,
      createAt: '2024-02-27T15:51:22.912Z',
      updateAt: '2024-02-27T15:51:22.912Z',
    },
    {
      id: 15,
      name: 'telefono',
      price: 80,
      available: true,
      createAt: '2024-02-27T15:51:27.876Z',
      updateAt: '2024-06-07T08:55:38.765Z',
    },
    {
      id: 16,
      name: 'Reproductor Blu-ray',
      price: 180,
      available: true,
      createAt: '2024-02-27T15:51:32.805Z',
      updateAt: '2024-02-27T15:51:32.805Z',
    },
    {
      id: 17,
      name: 'Teclado inalámbrico',
      price: 60,
      available: true,
      createAt: '2024-02-27T15:51:37.701Z',
      updateAt: '2024-02-27T15:51:37.701Z',
    },
    {
      id: 18,
      name: 'Mouse inalámbrico',
      price: 80,
      available: true,
      createAt: '2024-02-27T15:51:42.663Z',
      updateAt: '2024-02-27T15:51:42.663Z',
    },
  ];
  constructor() {
    const llamaServer = new IaProvider();
    llamaServer.getOllamaClient();
    this.Model = llamaServer.getModel();
    this.systemHandler = `Tu rol es asistir al cliente con sus solicitudes de búsqueda en la base de datos.

Debes seguir estas reglas para interpretar el prompt del cliente:

1. **Tipo de Búsqueda**:
   - Primero, determina si la búsqueda es **múltiple** o **sencilla**.

   **Búsqueda Múltiple**:
   - Si el cliente solicita una búsqueda que sugiere varios productos relacionados, como ingredientes para una receta o componentes para un proyecto, considera que se trata de una búsqueda múltiple.
   - Ejemplos de prompts para búsqueda múltiple:
     - "quiero hacer unas pasta carbonada" (sugiere varios ingredientes para pasta carbonada)
     - "quiero armar una pc gaming" (sugiere varios componentes para una PC gaming)
   - En este caso, 'action_name' debe ser "multiple_search".
   - Si los productos no están especificados en el prompt, infiere productos genéricos relevantes basados en el contexto del proyecto o receta mencionada.

   **Búsqueda Sencilla**:
   - Si el cliente solicita una búsqueda que parece específica para un solo producto o una consulta concreta, considera que se trata de una búsqueda sencilla.
   - Ejemplos de prompts para búsqueda sencilla:
     - "quiero una pasta carbonada" (sugiere un único producto o receta específica)
     - "quiero una pc gaming" (sugiere un solo conjunto o componente específico)
   - En este caso, 'action_name' debe ser "single_search".
   - Si el producto no está especificado en el prompt, infiere el producto genérico basado en el contexto del prompt.

2. **Formato de Respuesta**:
   - La respuesta debe incluir un arreglo de productos que puede tener varios productos o uno solo, dependiendo del tipo de búsqueda.
   - El formato de respuesta debe ser:
   {
     action: {
       action_name: "multiple_search" | "single_search"
     },
     products: [
       { 
         name: "nombre del producto",
       }
     ]
   }
   - Asegúrate de que la respuesta esté bien estructurada, incluyendo todos los productos que coincidan con la búsqueda solicitada o productos inferidos si no se especificaron claramente.
 `;
    this.systemRolProducts = `  Dado los resultados de la búsqueda de productos en la base de datos, realiza las siguientes acciones:
        
        - Si un producto es encontrado y debe ser agregado al carrito, debe ser registrado con la acción "save".
        - Si un producto no es encontrado, debe ser registrado con la acción "discard".
        
        La respuesta debe manejar uno o varios productos, y debe tener el siguiente formato:

        {
          action: {
            action_name: "save" | "discard"
          },
          response: {
            response_text: "respuesta en lenguaje natural que describa los resultados para cada producto"
          }
        }
        
        Ejemplo de respuesta para varios productos:

        {
          action: {
            action_name: "save"
          },
          response: {
            response_text: "Los productos X, Y y Z fueron encontrados y se han agregado al carrito. El producto A no se encontró y ha sido descartado. Los productos B y C también fueron encontrados y añadidos al carrito."
          }
        }
      `;
  }

  async handlerRequestproducts(prompt: string): Promise<any> {
    try {
      const response = await await generateObject({
        model: this.Model,
        system: this.systemHandler,
        temperature: 0,
        maxTokens: 400,
        schema: z.object({
          action: z
            .object({
              action_name: z.string(),
            })
            .nullable(),
          products: z
            .array(
              z.object({
                name: z.string(),
              }),
            )
            .optional(),
        }),
        prompt: prompt,
      });
      console.log(response);
      for (const i of response.object.products) {
        console.log(i.name);
      }
      ////search in db
      const foundProducts: any[] = [];
      const notFoundProducts: string[] = [];
      for (const product of response.object.products || []) {
        const foundProduct = this.db_products.find(
          (dbProduct) =>
            dbProduct.name.toLowerCase() === product.name.toLowerCase(),
        );
        if (foundProduct) {
          foundProducts.push(foundProduct);
        } else {
          notFoundProducts.push(product.name);
        }
      }
      console.log('productos encontrados');
      console.log(foundProducts);
      console.log('productos no encontrados');
      console.log(notFoundProducts);
      const context = `Prompt: ${prompt}, Productos encontrados: ${foundProducts
        .map((p) => p.name)
        .join(', ')}, Productos no encontrados: ${notFoundProducts.join(', ')}`;
      //// search scraping
      if (response.object.action.action_name === 'multiple_search') {
        console.log('busqueda multiple');
        return await this.generateProductsResponse(context);
      }

      if (response.object.action.action_name === 'single_search') {
        console.log('capa busqueda sencilla');

        return await this.generateProductsResponse(context);
      }

      //  return response.object.action;
    } catch (error) {
      console.error('Error generating response:', error);
      return 'Sorry, something went wrong.';
    }
  }

  async generateProductsResponse(prompt: string): Promise<any> {
    try {
      const response = await generateObject({
        model: this.Model,
        system: this.systemRolProducts,
        temperature: 0,
        maxTokens: 200,
        schema: z.object({
          action: z
            .object({
              action_name: z.string(),
            })
            .nullable(),
          response: z
            .object({
              response_text: z.string(),
            })
            .nullable(),
        }),

        prompt: prompt,
      });
      console.log(response);

      return response.object.response.response_text;
    } catch (error) {
      console.error('Error generating response:', error);
      return 'Sorry, something went wrong.';
    }
  }
}

/*
 

*/
