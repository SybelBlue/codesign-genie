import { type ValidSchema, SCHEMAS } from '$lib/types.d';
import { CohereClientV2 } from 'cohere-ai';
import { OpenAI } from 'openai';

// Add near the top of the file
const DEBUG = true;

// Export the implementations directly
export class OpenAIBackend {
  async generateObject<Type>(
    description: string,
    schema_to_select: ValidSchema,
    typedef: string,
    apiKey: string
  ): Promise<Type> {
    const SCHEMA = SCHEMAS[schema_to_select];
    const openai = new OpenAI({ apiKey: apiKey });

    const completion = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-2024-08-06',
      messages: [
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
    ${typedef}
    \`\`\`
    `
        },
        {
          role: 'user',
          content: `Please respond with JSON in the following schema: ${SCHEMA}`
        }
      ],

      response_format: {
        type: 'json_schema',
        json_schema: {
          name: schema_to_select,
          schema: SCHEMA
        }
      }
    });
    const event = completion.choices[0].message.parsed as Type;
    return event;
  }
}

export class CohereBackend {
  async generateObject<Type>(
    description: string,
    schema_to_select: ValidSchema,
    typedef: string,
    apiKey: string
  ): Promise<Type> {
    const cohere = new CohereClientV2({
      token: apiKey
    });
    const SCHEMA = SCHEMAS[schema_to_select];
    const model = 'command-r-plus';
    const messages = [
      {
        role: 'user',
        content: `You are helping create JSON objects for users. You will be given both a description and schema of the desired object.

Given the following description and type definition, please generate an object.
\`\`\`description
${description}
\`\`\`

\`\`\`typedef
${typedef}
\`\`\`

Please respond with JSON in the following schema: ${JSON.stringify(SCHEMA, null, 2)}

Respond ONLY with the JSON object, no additonal text.`
      }
    ];

    const response = await cohere.chat({
      model,
      messages: messages
    });

    if (DEBUG) {
      console.log('Cohere Response:', response);
    }

    try {
      // Parse the generated text as JSON
      const jsonStr = response.message.content[0].text.trim();
      const parsed = JSON.parse(jsonStr) as Type;
      return parsed;
    } catch (error) {
      throw new Error(`Failed to parse Cohere response as JSON: ${error}`);
    }
  }
}
