import type { Keyed, DeckJson, SimpleDeck } from './types';

import libraryJson from '$lib/crc-decks/library.json';
import rpgJson from '$lib/crc-decks/rpg.json';
import hospitalJson from '$lib/crc-decks/hospital.json';

import teamSyncJson from '$lib/crc-decks/data-col/team-sync.json';
import mediTrackJson from '$lib/crc-decks/data-col/medi-track.json';
import lib0Json from '$lib/crc-decks/data-col/library0.json';
import lib1Json from '$lib/crc-decks/data-col/library1.json';

export const withId: <T extends object>(o: T) => Keyed<T> = (function () {
  let nextId = 0;
  return (o) => {
    if ('id' in o) {
      if (typeof o.id === 'number') {
        nextId = Math.max(nextId, o.id);
      } else {
        delete o.id;
      }
    }

    return { id: nextId++, ...o };
  };
})();

export const deckWithIds = (deck: DeckJson): SimpleDeck => {
  const d: SimpleDeck = deck.cards.map((card) =>
    withId({
      id: card.id,
      name: card.name,
      responsibilities: card.responsibilities.map((r) =>
        withId({ id: r.id, description: r.description, collaborators: r.collaborators.map(withId) })
      )
    })
  );
  d.prompt = deck.prompt;
  return d;
};

export const exampleDecks: Record<string, SimpleDeck> = {
  rpg: deckWithIds(rpgJson),
  library: deckWithIds(libraryJson),
  hospital: deckWithIds(hospitalJson)
};

export const dataCollectionDecks: Record<string, SimpleDeck> = {
  teamSync: deckWithIds(teamSyncJson),
  mediTrack: deckWithIds(mediTrackJson),
  library0: deckWithIds(lib0Json)
};

dataCollectionDecks['library1'] = lib1Json.cards.map((c) => {
  const o = dataCollectionDecks.library0.find((x) => x.name == c.name);
  if (!o) return deckWithIds({ cards: [c] })[0];
  return {
    id: o.id,
    name: c.name,
    responsibilities: c.responsibilities.map((r, idx) => ({
      id: o.responsibilities[idx]?.id ?? withId({}).id,
      description: r.description,
      collaborators: r.collaborators.map((c, jdx) => ({
        id: o.responsibilities[idx]?.collaborators[jdx]?.id ?? withId({}).id,
        name: c.name
      }))
    }))
  };
});

export const premadeDecks: Record<string, SimpleDeck> = {
  ...exampleDecks,
  ...dataCollectionDecks
};

export function deepCopy<T extends SimpleDeck>(deck: T): T {
  return JSON.parse(JSON.stringify(deck)) as T;
}
