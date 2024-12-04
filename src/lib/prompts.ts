import { SCHEMAS, TYPEDEFS, type ValidSchema } from '$lib/types';

function buildContentSchemaString(description: string, schema: ValidSchema): string {
    const SCHEMA = SCHEMAS[schema];
    const TYPEDEF = TYPEDEFS[schema];
    const content = `Given the following description and type definition, please generate an object.
    \`\`\`description
    ${description}
    \`\`\`
    
    \`\`\`typedef
    ${TYPEDEF}
    \`\`\`
    Please respond with JSON in the following schema: ${SCHEMA}`;

    return content;
};

export { buildContentSchemaString };
