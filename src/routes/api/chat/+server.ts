// Defined in a `$REPO/.env` file as described in https://kit.svelte.dev/docs/modules#$env-static-private
import { CHAT_API_KEY } from '$env/static/private';
import type { Message, ChatRequest } from '$lib/types';
import { CohereBackend, OpenAIBackend } from '$lib/ai';

async function fetchChat(messages: Array<Message>, systemMessage: string = ''): Promise<String> {
  const ENDPOINT_URL: URL = new URL('https://api.openai.com/v1/chat/completions');
  const MODEL: string = 'gpt-4o';

  if (systemMessage !== '') {
    messages.unshift({
      role: 'system',
      content: systemMessage
    });
  }

  const response = await fetch(ENDPOINT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${CHAT_API_KEY}`
    },
    body: JSON.stringify({
      messages: messages,
      model: MODEL
      /* Potentially useful arguments later on: (pulled from https://platform.openai.com/docs/api-reference/chat/object)
      n: 1, // how many completions to generate (i.e. how many "attempts" should it make)
      max_completion_tokens: null, // how many (max) tokens to generate in total
      response_format: null, // output format: { "type": "json_schema", "json_schema": {...} } ensures the model will match "json_schema" ;;; { "type" : "json_object" } ensures the model will produce valid json
      stop: null, // up to 4 sequences that signal termination of generation
      temperature: 1, // higher values make generations more random, lower makes them less random. Between 0 and 2
      top_p: 1, // number to use in nucleus sampling ("only the tokens comprising the `top_p` probability mass are considered"). Either/or with `temperature`
      tools: [ ], // A list of functions the model may generate JSON inputs for. A max of 128 functions are supported. ;; { type: str, function : { name: str[a-zA-Z0-9_\-]{*64}, description*: str, parameters* : schema, strict*: bool }
      tool_choice: "none", // "none" -> don't generate tool call ;; "auto" -> can choose to generate tool call or message ;; "required" -> generate tool call ;; {"type": "function", "function": {"name": "my_function"}} -> generate a call for this specific function
      // */
    })
  });

  const completion = await response.json();
  return completion.choices[0].message.content;
}

const SYSTEM_PROMPTS = {
  default: ''
};

export const POST = async ({ request }) => {
  if (request.body == null) {
    return new Response('Please provide a request body!', { status: 400 });
  }

  const req: ChatRequest = await request.json();

  let sysprompt: string;
  if (req.sysprompt in SYSTEM_PROMPTS) {
    // sysprompt = SYSTEM_PROMPTS[req.sysprompt];
  } else {
    sysprompt = req.sysprompt;
  }

  const data = {
    // response: await fetchChat(req.messages, sysprompt)
  };

  return new Response(JSON.stringify(data), { status: 200 });
};
