export type Key = number;
export type Keyed<T> = T & { id: Key };

export type Message = {
  role: string;
  content: string;
};

export type ChatRequest = {
  sysprompt: string;
  messages: Array<Message>;
};

export type GenerationRequest = {
  description: string;
  schema: ValidSchema;
};

export type JSONObjectSchema = {
  type: 'object';
  description: string;
  additionalProperties: false;
  required: Array<string>;
  properties: { [key: string]: JSONSchema };
};

type JSONPrimitiveSchema = {
  type: string;
  description: string;
};

type JSONArraySchema = {
  type: 'array';
  description: string;
  items: JSONSchema;
};

export type JSONSchema = JSONObjectSchema | JSONArraySchema | JSONPrimitiveSchema;

const CARD_SCHEMA: JSONObjectSchema = {
  type: 'object',
  description:
    'A single Class-Responsibility-Collaborator (CRC) card to be used in Agile software development',
  properties: {
    name: {
      type: 'string',
      description: 'The name of the resource, e.g. Library'
    },
    responsibilities: {
      type: 'array',
      description: 'The responsibilities that the resource has, e.g. Maintains a ledger of library cards',
      items: {
        type: 'object',
        properties: {
          description: {
            type: 'string',
            description:
              'A responsibility that the resource has, e.g. Maintains a ledger of library cards'
          },
          collaborators: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'The collaborating resources for this resource, e.g. LibraryCard'
                }
              }
            }
          }
        }
      }
    }
  },
  additionalProperties: false,
  required: ['name', 'responsibilities', 'collaborators']
};

const DECK_SCHEMA: JSONObjectSchema = {
  type: 'object',
  description:
    'A deck of Class-Responsibility-Collaborator (CRC) cards to be used in Agile software development',
  properties: {
    cards: {
      type: 'array',
      items: CARD_SCHEMA,
      description: 'A list of all the cards in the deck'
    }
  },
  additionalProperties: false,
  required: ['cards']
};

export type ValidSchema = 'Card' | 'Deck';
export const SCHEMAS = {
  Card: CARD_SCHEMA,
  Deck: DECK_SCHEMA
};

export const TYPEDEFS = {
  Card: `
{
  name: string;
  responsibilities: Array<{
    description: string;
    collaborators: Array<{ name: string }>;
  }>;
}
`.trim(),
  Deck: `
{
  cards: Array<{
    name: string;
    responsibilities: Array<{
      description: string;
      collaborators: Array<{ name: string }>;
    }>;
  }>;
}
`.trim()
};

export type Deck = {
  cards: Array<{
    name: string;
    responsibilities: Array<{
      description: string;
      collaborators: Array<{ name: string }>;
    }>;
  }>;
};

import type { Props as CardProps } from '$lib/components/Card.svelte';
import type { Props as CardBoardProps } from './components/CardBoard.svelte';

export { CardProps, CardBoardProps };
