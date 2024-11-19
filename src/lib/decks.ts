import type { Deck, Keyed } from './types';

import libraryJson from '$lib/crc-decks/library.json';
import rpgJson from '$lib/crc-decks/rpg.json';
import hospitalJson from '$lib/crc-decks/hospital.json';
import nelson0 from '$lib/crc-decks/nelson-deck0.json';
import nelson1 from '$lib/crc-decks/nelson-deck1.json';

export const withId: <T extends object>(o: T) => Keyed<T> = (function () {
  let nextId = 0;
  return (o) => ({ ...o, id: nextId++ });
})();

export const exampleDecks: Record<string, Deck> = {
  rpg: rpgJson.map((card) =>
    withId({
      name: card.name,
      responsibilities: card.responsibilities.map((r) =>
        withId({ description: r.description, collaborators: r.collaborators.map(withId) })
      )
    })
  ),
  library: libraryJson.map((card) =>
    withId({
      name: card.name,
      responsibilities: card.responsibilities.map((r) =>
        withId({ description: r.description, collaborators: r.collaborators.map(withId) })
      )
    })
  ),
  hospital: hospitalJson.map((card) =>
    withId({
      name: card.name,
      responsibilities: card.responsibilities.map((r) =>
        withId({ description: r.description, collaborators: r.collaborators.map(withId) })
      )
    })
  ),
  nelson0,
  nelson1: nelson1.map((c) => {
    const pair = nelson0.find((x) => x.name == c.name);
    return {
      ...c,
      id: pair?.id ?? c.id,
      responsibilities: pair
        ? c.responsibilities.map((r, idx) => ({
            ...r,
            id: pair.responsibilities[idx].id
          }))
        : c.responsibilities
    };
  }),
  caraMid: [
    {
      name: 'Coherence',
      responsibilities: [].map(withId)
    },
    {
      name: 'DesignAid',
      responsibilities: [
        {
          description: 'Basic Cards',
          collaborators: ['Cards', 'Svelte', 'DaisyUI'].map((name) => withId({ name }))
        }
      ].map(withId)
    },
    {
      name: 'Example',
      responsibilities: [
        { description: 'Removed', collaborators: [] },
        { description: 'Changeede text', collaborators: [] }
      ].map(withId)
    }
  ].map(withId)
};

const dummyCard = (name: string): Deck[number] => withId({ name, responsibilities: [] });
exampleDecks.caraNow = (() => {
  const out = JSON.parse(JSON.stringify(exampleDecks.caraMid)) as Deck;
  out[0].responsibilities = [
    {
      description: 'Reliance on json_schema',
      collaborators: ['OpenAI'].map((name) => withId({ name }))
    },
    {
      description: '2-stage Generation',
      collaborators: ['OpenAI', 'GenAI'].map((name) => withId({ name }))
    }
  ].map(withId);
  out[1].responsibilities.push(
    ...[
      {
        description: 'Visual Diffing',
        collaborators: ['JsDiff'].map((name) => withId({ name }))
      },
      {
        description: 'Commit Timeline',
        collaborators: [].map((name) => withId({ name }))
      },
      {
        description: 'Multiple Backends',
        collaborators: 'GenAI'.split(' ').map((name) => withId({ name }))
      }
    ].map(withId)
  );
  out[2].responsibilities[1].description = 'Changed text';
  out[2].responsibilities[0] = withId({
    description: 'Added',
    collaborators: []
  });

  return out;
})();
exampleDecks.caraFuture = (() => {
  const out = JSON.parse(JSON.stringify(exampleDecks.caraNow)) as Deck;
  console.table(out);
  out[0].responsibilities[1].description = 'Merge ' + out[0].responsibilities[1].description;
  out[1].responsibilities[3] = {
    id: out[1].responsibilities[3].id,
    description: 'Comparable Backends',
    collaborators: [...out[1].responsibilities[3].collaborators, withId({ name: 'OpenAI' })]
  };
  out[0].responsibilities.splice(0, 1);
  out[1].responsibilities[2].description = 'Branching ' + out[1].responsibilities[2].description;
  out[1].responsibilities.push(
    ...[
      {
        description: 'Free Editing*',
        collaborators: ['Svelte'].map((name) => withId({ name }))
      },
      {
        description: 'Cost Estimation*',
        collaborators: ['Svelte', 'GenAI'].map((name) => withId({ name }))
      }
    ].map(withId)
  );
  return out;
})();
const nameDummies: Deck = [
  ...new Set(
    [...exampleDecks.caraFuture, ...exampleDecks.caraMid, ...exampleDecks.caraNow]
      .flatMap((c) => c.responsibilities)
      .flatMap((r) => r.collaborators)
      .map((c) => c.name)
  )
].map(dummyCard);
exampleDecks.caraMid.push(...nameDummies);
exampleDecks.caraNow.push(...nameDummies);
exampleDecks.caraFuture.push(...nameDummies);

export const decodeDeck = (deckInfo: string) => {
  const json_string = atob(deckInfo);
  const deck = JSON.parse(json_string).response.cards;
  return deck.map((card: { name: string; responsibilities: string[]; collaborators: string[] }) =>
    withId({
      name: card.name,
      responsibilities: card.responsibilities.map((responsibility) =>
        withId({
          text: responsibility
        })
      ),
      collaborators: card.collaborators.map((collaborator) =>
        withId({
          name: collaborator
        })
      )
    })
  );
};
