import type { ValidSchema } from '$lib/types';

function buildContentString(description: string): string {
    const content = `Given the following description, please generate an object.
    \`\`\`description
    ${description}
    \`\`\`
    `;
    return content;
};

function buildContentSchemaString(description: string, schema: ValidSchema, typedef: string): string {
    const content = `Given the following description and type definition, please generate an object.
    \`\`\`description
    ${description}
    \`\`\`
    
    \`\`\`typedef
    ${typedef}
    \`\`\`
    Please respond with JSON in the following schema: ${schema}`;

    return content;
};

export { buildContentSchemaString, buildContentString };