
// Defined in a `$REPO/.env` file as described in https://kit.svelte.dev/docs/modules#$env-static-private
import { CHAT_API_KEY } from '$env/static/private';
import {
  type Message,
  type ValidSchema,
  SCHEMAS,
  TYPEDEFS
} from '$lib/types.d';


export async function generateObject<Type>(
    description: string,
    schema_to_select: ValidSchema
  ): Promise<Type> {
  const ENDPOINT_URL: URL = new URL('https://api.openai.com/v1/chat/completions');
  const MODEL: string = 'gpt-4o';
  const SCHEMA = SCHEMAS[schema_to_select];
  const TYPEDEF = TYPEDEFS[schema_to_select];

  const messages: Array<Message> = [
    {
      role: 'system',
      content:
        'You are helping create JSON objects for users. You will be given both a description and schema of the desired object.'
    },
    {
      role: 'user',
      content: `Given the following description and type definition, please generate an object.
\`\`\`description
${description}
\`\`\`

\`\`\`typedef
${TYPEDEF}
\`\`\`
`
    }
  ];

  messages.push({
    role: 'user',
    content: `Please respond with JSON in the following schema: ${SCHEMA}`
  });

  const req_body = {
    messages: messages,
    model: MODEL,
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: schema_to_select,
        schema: SCHEMA
      }
    }
  };

  console.log(req_body);

  const response: Promise<Type> = fetch(ENDPOINT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${CHAT_API_KEY}`
    },
    body: JSON.stringify(req_body)
  }).then((value) =>
    value.json().then((completion) => {
      console.log('Got OAI response', completion);
      const json_response: string = completion.choices[0].message.content;
      const response_object: Type = JSON.parse(json_response);
      console.log('Raw response:', response_object);
      return response_object;
    })
  );
  
  return response;
}
