import { buildContentString, buildContentSchemaString } from './chat';
import type { ValidSchema } from '$lib/types';
import { expect, describe, it } from 'vitest';

describe('chat.ts', () => {
    describe('buildContentString', () => {
        it('should format the content string correctly', () => {
            // Arrange
            const description = "Create a user object";

            // Act
            const result = buildContentString(description);

            // Assert
            expect(result).toBe(
                `Given the following description, please generate an object.
    \`\`\`description
    Create a user object
    \`\`\`
    `
            );
        });
    });

    describe('buildContentSchemaString', () => {
        it('should format the content string correctly', () => {
            // Arrange
            const description = "Create a user object";
            const schema: ValidSchema = {} as ValidSchema;
            const typedef = "interface User { name: string; age: number; }";

            // Act
            const result = buildContentSchemaString(description, schema, typedef);

            // Assert
            expect(result).toBe(
                `Given the following description and type definition, please generate an object.
    \`\`\`description
    ${description}
    \`\`\`
    
    \`\`\`typedef
    ${typedef}
    \`\`\`
    Please respond with JSON in the following schema: ${schema}`
            );
        });
    });
}); 