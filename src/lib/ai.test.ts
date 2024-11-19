import { OpenAIBackend, CohereBackend } from './ai'
import { type ValidSchema, type TestSchema, TYPEDEFS } from '$lib/types.d';
import { expect, describe, it } from 'vitest';
import { CHAT_API_KEY, COHERE_API_KEY } from '$env/static/private';

describe('AI Backends', async () => {   
    describe('OpenAIBackend', async () => {
        it('should generate an object based on description', async () => {
            const openai = new OpenAIBackend();
            const description = "Create a person named Alice who is 25 years old";
            const result = await openai.generateObject<TestSchema>(
                description,
                'TestSchema' as ValidSchema,
                TYPEDEFS.TestSchema,
                CHAT_API_KEY
            );
            console.log(result);
            expect(result).toHaveProperty('name');
            expect(result).toHaveProperty('age');
            expect(typeof result.name).toBe('string');
            expect(typeof result.age).toBe('number');
        });

        it('should handle OpenAI errors', async () => {
            const description = "Create a person named Alice who is 25 years old";
            const openai_test = new OpenAIBackend();
            await expect(
                openai_test.generateObject(
                    description,
                    'TestSchema' as ValidSchema,
                    TYPEDEFS.TestSchema,
                    'invalid-key' 
                )
            ).rejects.toThrow();
        });

    });

    describe('CohereBackend', () => {
        it('should generate an object based on description', async () => {
            const description = "Create a person named Alice who is 25 years old";
            const cohere = new CohereBackend({ apiKey: COHERE_API_KEY });    
            const result = await cohere.generateObject<TestSchema>(
                description,
                'TestSchema' as ValidSchema,
                TYPEDEFS.TestSchema,
                COHERE_API_KEY
            );
            console.log(result);
            expect(result).toHaveProperty('name');
            expect(result).toHaveProperty('age');
            expect(typeof result.name).toBe('string');
            expect(typeof result.age).toBe('number');
        });

        it('should handle Cohere errors', async () => {
            const cohere = new CohereBackend({ apiKey: 'invalid-key' });
            await expect(
                cohere.generateObject('Generate a test person', 'TestSchema' as ValidSchema)
            ).rejects.toThrow();
        });
    });
});
