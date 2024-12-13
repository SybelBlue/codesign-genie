import type { Keyed, DeckJson, SimpleDeck } from './types';

import libraryJson from '$lib/crc-decks/library.json';
import rpgJson from '$lib/crc-decks/rpg.json';
import hospitalJson from '$lib/crc-decks/hospital.json';

import teamSyncJson from '$lib/crc-decks/data-col/team-sync.json';
import mediTrackJson from '$lib/crc-decks/data-col/medi-track.json';
import ecoTrackJson from '$lib/crc-decks/data-col/ecotrack.json';
import libAI0Json from '$lib/crc-decks/data-col/libraryAI0.json';
import libAI1Json from '$lib/crc-decks/data-col/libraryAI1.json';
import libCE0Json from '$lib/crc-decks/data-col/libraryCE0.json';
import libCE1Json from '$lib/crc-decks/data-col/libraryCE1.json';
import techDebtKillGod0Json from '$lib/crc-decks/data-col/technical-debt-kill-god0.json';
import techDebtKillGod1Json from '$lib/crc-decks/data-col/technical-debt-kill-god1.json';
import techDebtMakeGod0Json from '$lib/crc-decks/data-col/technical-debt-make-god0.json';
import techDebtMakeGod1Json from '$lib/crc-decks/data-col/technical-debt-make-god1.json';
import casiNoAI0Json from '$lib/crc-decks/data-col/casiNoAI0.json';
import casiNoAI1Json from '$lib/crc-decks/data-col/casiNoAI1.json';
import casiNoWeb0Json from '$lib/crc-decks/data-col/casiNoWeb0.json';
import casiNoWeb1Json from '$lib/crc-decks/data-col/casiNoWeb1.json';
import casiNoCash0Json from '$lib/crc-decks/data-col/casiNoCash0.json';
import casiNoCash1Json from '$lib/crc-decks/data-col/casiNoCash1.json';

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

const asCommit = (json: DeckJson, base: SimpleDeck): SimpleDeck => {
  const out: SimpleDeck = json.cards.map((c) => {
    const o = base.find((x) => x.name == c.name);
    if (!o) return deckWithIds({ cards: [c] })[0];
    return {
      id: o.id,
      name: c.name,
      responsibilities: c.responsibilities.map((r, idx) => {
        const oResp =
          o.responsibilities.find((x) => x.description == r.description) ?? o.responsibilities[idx];
        return {
          id: oResp?.id ?? withId({}).id,
          description: r.description,
          collaborators: r.collaborators.map((c, jdx) => ({
            id: (
              oResp?.collaborators.find((x) => x.name == c.name) ??
              oResp?.collaborators[jdx] ??
              withId({})
            ).id,
            name: c.name
          }))
        };
      })
    };
  });
  out.prompt = json.prompt ?? base.prompt;
  return out;
};

export const exampleDecks: Record<string, SimpleDeck> = {
  rpg: deckWithIds(rpgJson),
  library: deckWithIds(libraryJson),
  hospital: deckWithIds(hospitalJson)
};

export const dataCollectionDecks: Record<string, SimpleDeck> = {
  teamSync: deckWithIds(teamSyncJson),
  mediTrack: deckWithIds(mediTrackJson),
  ecoTrack: deckWithIds(ecoTrackJson),
  libraryAI0: deckWithIds(libAI0Json),
  libraryCE0: deckWithIds(libCE0Json),
  killGod0: deckWithIds(techDebtKillGod0Json),
  makeGod0: deckWithIds(techDebtMakeGod0Json),
  casiNoAI0: deckWithIds(casiNoAI0Json),
  casiNoWeb0: deckWithIds(casiNoWeb0Json),
  casiNoCash0: deckWithIds(casiNoCash0Json)
};

dataCollectionDecks.libraryAI1 = asCommit(libAI1Json, dataCollectionDecks.libraryAI0);
dataCollectionDecks.libraryCE1 = asCommit(libCE1Json, dataCollectionDecks.libraryCE0);
dataCollectionDecks.killGod1 = asCommit(techDebtKillGod1Json, dataCollectionDecks.killGod0);
dataCollectionDecks.makeGod1 = asCommit(techDebtMakeGod1Json, dataCollectionDecks.makeGod0);
dataCollectionDecks.casiNoAI1 = asCommit(casiNoAI1Json, dataCollectionDecks.casiNoAI0);
dataCollectionDecks.casiNoWeb1 = asCommit(casiNoWeb1Json, dataCollectionDecks.casiNoWeb0);
dataCollectionDecks.casiNoCash1 = asCommit(casiNoCash1Json, dataCollectionDecks.casiNoCash0);

dataCollectionDecks['A1-0'] = dataCollectionDecks.libraryAI0;
dataCollectionDecks['A1-1'] = dataCollectionDecks.libraryAI1;
dataCollectionDecks['A2-0'] = dataCollectionDecks.libraryCE0;
dataCollectionDecks['A2-1'] = dataCollectionDecks.libraryCE1;
dataCollectionDecks['B1-0'] = dataCollectionDecks.killGod0;
dataCollectionDecks['B1-1'] = dataCollectionDecks.killGod1;
dataCollectionDecks['B2-0'] = dataCollectionDecks.makeGod0;
dataCollectionDecks['B2-1'] = dataCollectionDecks.makeGod1;
dataCollectionDecks['C1-0'] = dataCollectionDecks.casiNoCash0;
dataCollectionDecks['C1-1'] = dataCollectionDecks.casiNoCash1;
dataCollectionDecks['C2-0'] = dataCollectionDecks.casiNoAI0;
dataCollectionDecks['C2-1'] = dataCollectionDecks.casiNoAI1;
dataCollectionDecks['C3-0'] = dataCollectionDecks.casiNoWeb0;
dataCollectionDecks['C3-1'] = dataCollectionDecks.casiNoWeb1;

export const premadeDecks: Record<string, SimpleDeck> = {
  ...exampleDecks,
  ...dataCollectionDecks
};

export function deepCopy<T extends SimpleDeck>(deck: T): T {
  const out = JSON.parse(JSON.stringify(deck)) as T;
  out.prompt = deck.prompt;
  return out;
}
