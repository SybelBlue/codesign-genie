import type { CardBoardProps, Keyed, Deck } from './types';

import libraryJson from '$lib/crc-decks/library.json';
import rpgJson from '$lib/crc-decks/rpg.json';
import hospitalJson from '$lib/crc-decks/hospital.json';

export const withId: <T extends object>(o: T) => Keyed<T> = (function () {
  let nextId = 0;
  return (o) => ({ ...o, id: nextId++ });
})();

export const deckWithIds = (deck: Deck): CardBoardProps['cards'] => {
  return deck.cards.map((card) =>
    withId({
      name: card.name,
      responsibilities: card.responsibilities.map((r) =>
        withId({ description: r.description, collaborators: r.collaborators.map(withId) })
      )
    })
  );
};

export const exampleDecks: Record<string, CardBoardProps['cards']> = {
  rpg: deckWithIds(rpgJson),
  library: deckWithIds(libraryJson),
  hospital: deckWithIds(hospitalJson)
};
