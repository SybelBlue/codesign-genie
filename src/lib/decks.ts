import type { CardBoardProps, Keyed } from './types';

import libraryJson from '$lib/crc-decks/library.json';
import rpgJson from '$lib/crc-decks/rpg.json';
import hospitalJson from '$lib/crc-decks/hospital.json';

export const withId: <T extends object>(o: T) => Keyed<T> = (function () {
  let nextId = 0;
  return (o) => ({ ...o, id: nextId++ });
})();

export const exampleDecks: Record<string, CardBoardProps['cards']> = {
  rpg: rpgJson.map((card) =>
    withId({
      name: card.name,
      responsibilities: card.responsibilities.map((r) => withId(
        {description: r.description, collaborators: r.collaborators.map(withId)}
      )),
    })),
  library: libraryJson.map((card) =>
    withId({
      name: card.name,
      responsibilities: card.responsibilities.map((r) => withId(
        {description: r.description, collaborators: r.collaborators.map(withId)}
      )),
    })),
  hospital: hospitalJson.map((card) =>
    withId({
      name: card.name,
      responsibilities: card.responsibilities.map((r) => withId(
        {description: r.description, collaborators: r.collaborators.map(withId)}
      )),
    }))
};

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
