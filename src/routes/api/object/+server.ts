import { CHAT_API_KEY, COHERE_API_KEY } from '$env/static/private';
import { type GenerationRequest } from '$lib/types.d';
import { OpenAIBackend, CohereBackend } from '$lib/ai';
import { buildContentSchemaString } from '$lib/chat';

// Create instances of the backends
const openaiBackend = new OpenAIBackend();
const cohereBackend = new CohereBackend();

export const POST = async ({ request }) => {
  if (request.body == null) {
    return new Response('Please provide a request body!', { status: 400 });
  }

  return request.json().then(
    async (req: GenerationRequest) => {
      try {
        // Use the specified backend or default to OpenAI
        const backend = req.backend === 'cohere' ? cohereBackend : openaiBackend;
        const apiKey = req.backend === 'cohere' ? COHERE_API_KEY : CHAT_API_KEY;

        // Use buildContentSchemaString for schema-based generation
        const content = buildContentSchemaString(req.description, req.schema, req.typedef);
        
        const obj = await backend.generateObject(
          content,
          req.schema,
          req.typedef,
          apiKey
        );

        const data = { response: obj };
        return new Response(JSON.stringify(data), { status: 200 });
      } catch (error) {
        console.error('Generation failed:', error);
        return new Response(`Generation failed: ${error.message}`, { status: 500 });
      }
    },
    (failure_reason) => {
      return new Response('Invalid JSON!', { status: 400 });
    }
  );
};