import type { Backend } from "$lib/types";
import { BACKENDS } from "$lib/ai";
import { buildSolveTaskPrompt } from "$lib/prompts";
import { dataCollectionDecks, type DeckCode } from "$lib/decks";

export const POST = async ({ request }) => {
  if (request.body == null) {
    return new Response('Please provide a request body!', { status: 400 });
  }

  return request.json().then(
    async (req: {
      backend: Backend,
      task: string,
      deckCode: DeckCode
    }) => {
      // Use the specified backend or default to OpenAI
      const ai = BACKENDS[req.backend];

      const deck = dataCollectionDecks[req.deckCode];

      const content = buildSolveTaskPrompt(req.task, {cards: deck});

      try {
        const obj = await ai.backend.generateObject(
          content,
          'Deck',
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