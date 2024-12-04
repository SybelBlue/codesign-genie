import { CHAT_API_KEY, COHERE_API_KEY } from '$env/static/private';
import { type GenerationRequest } from '$lib/types.d';
import { OpenAIBackend, CohereBackend } from '$lib/ai';
import { buildContentSchemaString } from '$lib/chat';

// Create instances of the backends
const BACKENDS = {
  "cohere" : {
    "apiKey" : COHERE_API_KEY,
    "backend" : new CohereBackend()
  },
  "openai" : {
    "apiKey" : CHAT_API_KEY,
    "backend" : new OpenAIBackend()
  }
}

export const POST = async ({ request }) => {
  if (request.body == null) {
    return new Response('Please provide a request body!', { status: 400 });
  }

  return request.json().then(
    async (req: GenerationRequest) => {
      // Use the specified backend or default to OpenAI
      const ai = BACKENDS[req.backend];

      // Use buildContentSchemaString for schema-based generation
      const content = buildContentSchemaString(req.description, req.schema);

      try {
        const obj = await ai.backend.generateObject(
          content,
          req.schema,
          ai.apiKey
        );

        const data = { response: obj };
      return new Response(JSON.stringify(data), { status: 200 });
      } catch (error) {
        console.error('Generation failed:', error);
        // @ts-expect-error
        return new Response(`Generation failed: ${error.message}`, { status: 500 });
      }
    },
    (failure_reason) => {
      return new Response('Invalid JSON!', { status: 400 });
    }
  );
};
