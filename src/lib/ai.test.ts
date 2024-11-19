import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OpenAIBackend, CohereBackend } from './ai';
import type { ValidSchema } from './types';

describe('AI Backends', () => {
    // Mock fetch for OpenAI
    const mockFetch = vi.fn();
    global.fetch = mockFetch;

    // Mock Cohere client
    vi.mock('cohere-ai', () => ({
        CohereClientV2: vi.fn().mockImplementation(() => ({
            chat: vi.fn()
        }))
    }));

    beforeEach(() => {
        mockFetch.mockClear();
        vi.clearAllMocks();
    });

    describe('OpenAIBackend', () => {
        it('should generate an object based on description', async () => {
            // Mock successful OpenAI response
            mockFetch.mockResolvedValueOnce({
                json: () => Promise.resolve({
                    choices: [{
                        message: {
                            content: JSON.stringify({
                                name: "Test Person",
                                age: 25
                            })
                        }
                    }]
                }),
                clone: () => ({
                    json: () => Promise.resolve({ /* mock response data */ })
                })
            });

            const openai = new OpenAIBackend();
            const result = await openai.generateObject(
                'Generate a test person',
                'TestSchema' as ValidSchema
            );

            expect(result).toEqual({
                name: "Test Person",
                age: 25
            });
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        it('should handle OpenAI errors', async () => {
            mockFetch.mockResolvedValueOnce({
                json: () => Promise.resolve({
                    error: { message: 'API Error' }
                }),
                clone: () => ({
                    json: () => Promise.resolve({ error: { message: 'API Error' } })
                })
            });

            const openai = new OpenAIBackend();
            await expect(
                openai.generateObject('Generate a test person', 'TestSchema' as ValidSchema)
            ).rejects.toThrow('API Error');
        });
    });

    describe('CohereBackend', () => {
        it('should generate an object based on description', async () => {
            // Mock successful Cohere response
            const mockCohereResponse = {
                message: {
                    content: {
                        name: "Test Person",
                        age: 25
                    }
                }
            };

            const cohere = new CohereBackend();
            // @ts-ignore - accessing private property for test
            cohere.cohere.chat.mockResolvedValueOnce(mockCohereResponse);

            const result = await cohere.generateObject(
                'Generate a test person',
                'TestSchema' as ValidSchema
            );

            expect(result).toEqual({
                name: "Test Person",
                age: 25
            });
        });

        it('should handle Cohere errors', async () => {
            const cohere = new CohereBackend();
            // @ts-ignore - accessing private property for test
            cohere.cohere.chat.mockRejectedValueOnce(new Error('Cohere API Error'));

            await expect(
                cohere.generateObject('Generate a test person', 'TestSchema' as ValidSchema)
            ).rejects.toThrow('Cohere API Error');
        });
    });
});