import { type GenerationRequest } from '$lib/types.d';
import { BACKENDS } from '$lib/ai';
import { buildContentString } from '$lib/chat';

export const POST = async ({ request }) => {
  if (request.body == null) {
    return new Response('Please provide a request body!', { status: 400 });
  }

  return request.json().then(
    async (req: GenerationRequest) => {
      const ai = BACKENDS[req.backend];

      // Use buildContentString for free-form chat
      const content = buildContentString(req.description);
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
        return new Response(`Generation failed: ${error.message}`, { status: 500 });
      }
    },
    (failure_reason) => {
      return new Response('Invalid JSON!', { status: 400 });
    }
  );
};
