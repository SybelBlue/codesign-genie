import { CHAT_API_KEY, COHERE_API_KEY } from '$env/static/private';
import { type Message, type ValidSchema, SCHEMAS, TYPEDEFS } from '$lib/types.d';

const { CohereClientV2 } = require('cohere-ai');
const cohere = new CohereClientV2({
    token: COHERE_API_KEY,
});


// Add near the top of the file
const DEBUG = true;


// Export the implementations directly
export class OpenAIBackend {
    private readonly ENDPOINT_URL = new URL('https://api.openai.com/v1/chat/completions');
    private readonly MODEL = 'gpt-4';

    async generateObject<Type>(description: string, schema_to_select: ValidSchema): Promise<Type> {
        if (DEBUG) {
            console.log('OpenAI Request:', {
                description,
                schema: SCHEMAS[schema_to_select],
                typedef: TYPEDEFS[schema_to_select]
            });
        }
        
        const SCHEMA = SCHEMAS[schema_to_select];
        const TYPEDEF = TYPEDEFS[schema_to_select];

        const messages: Array<Message> = [
            {
                role: 'system',
                content: 'You are helping create JSON objects for users. You will be given both a description and schema of the desired object.'
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
            },
            {
                role: 'user',
                content: `Please respond with JSON in the following schema: ${SCHEMA}`
            }
        ];

        const response = await fetch(this.ENDPOINT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CHAT_API_KEY}`
            },
            body: JSON.stringify({
                messages,
                model: this.MODEL,
                response_format: {
                    type: 'json_schema',
                    json_schema: {
                        name: schema_to_select,
                        schema: SCHEMA
                    }
                }
            })
        });

        if (DEBUG) {
            console.log('OpenAI Response:', await response.clone().json());
        }
        
        const completion = await response.json();
        if (completion.error) {
            throw new Error(completion.error.message);
        }
        return JSON.parse(completion.choices[0].message.content) as Type;
    }
}

export class CohereBackend {
    async generateObject<Type>(description: string, schema_to_select: ValidSchema): Promise<Type> {
        if (DEBUG) {
            console.log('Cohere Request:', {
                description,
                schema: SCHEMAS[schema_to_select]
            });
        }

        const response = await cohere.chat({
            model: 'command-r-plus',
            messages: [
                {
                    role: 'user',
                    content: `Given this description: ${description}, generate a JSON object.`
                }
            ],
            response_format: {
                type: 'json_object',
                schema: SCHEMAS[schema_to_select]  // Use the schema from SCHEMAS object
            }
        });

        if (DEBUG) {
            console.log('Cohere Response:', response);
        }

        return response.message.content as Type;
    }
}
