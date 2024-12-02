import type { ValidSchema } from '$lib/types';

function buildContentString(description: string, schema: ValidSchema, typedef: string): string {
    const content = `Given the following description and type definition, please generate an object.
    \`\`\`description
    ${description}
    \`\`\`
    
    \`\`\`typedef
    ${typedef}
    \`\`\`
    `;
    return content;
};

export { buildContentString };