// Defined in a `$REPO/.env` file as described in https://kit.svelte.dev/docs/modules#$env-static-private
import { CHAT_API_KEY } from '$env/static/private';
import { type Message } from '$lib/types.js';

async function generateObject<Type>(messages: Array<Message>, type: Type): Promise<Type> {
  console.log();
  ...
}
