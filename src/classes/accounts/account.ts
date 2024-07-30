import { Nip07Signer } from '../../types/nostr-extensions';

export class Account {
	readonly type: string = 'unknown';
	pubkey: string;
	signer?: Nip07Signer;

	get readonly() {
		return !this.signer;
	}

	constructor(pubkey: string) {
		this.pubkey = pubkey;
	}

	toJSON(): any {
		return { type: this.type, pubkey: this.pubkey };
	}
	fromJSON(data: any): this {
		this.pubkey = data.pubkey;
		return this;
	}
}
