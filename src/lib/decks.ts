import type { Keyed, DeckJson, SimpleDeck } from './types';

import libraryJson from '$lib/crc-decks/library.json';
import rpgJson from '$lib/crc-decks/rpg.json';
import hospitalJson from '$lib/crc-decks/hospital.json';

export const withId: <T extends object>(o: T) => Keyed<T> = (function () {
  let nextId = 0;
  let skipIds = new Set();
  return (o) => {
    if ("id" in o) {
      let id = Number(o.id);
      if (id != 0 && !id) {
        throw TypeError(`Encountered non-numeric id!: ${o.id} in ${o}`);
      }
      skipIds.add(id);
    }
    while (skipIds.has(nextId)) {
      skipIds.delete(nextId++);
    }
    return { id: nextId++, ...o };
  };
})();

export const deckWithIds = (deck: DeckJson): SimpleDeck => {
  return deck.cards.map((card) =>
    withId({
      name: card.name,
      responsibilities: card.responsibilities.map((r) =>
        withId({ description: r.description, collaborators: r.collaborators.map(withId) })
      )
    })
  );
};

export const exampleDecks: Record<string, SimpleDeck> = {
  rpg: deckWithIds(rpgJson),
  library: deckWithIds(libraryJson),
  hospital: deckWithIds(hospitalJson)
};
