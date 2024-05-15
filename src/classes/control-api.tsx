import {
	ControlMessage,
	ControlResponse,
	DatabaseStats,
	ReceiverStatus,
} from '@satellite-earth/core/types/control-api.js';
import { PrivateNodeConfig } from '@satellite-earth/core/types/private-node-config.js';

import Subject, { PersistentSubject } from './subject';
import PrivateNode from './private-node';

const MAX_LOG_LINES = 200;

export default class PrivateNodeControlApi {
	node: PrivateNode;

	logs = new PersistentSubject<string[]>([]);
	config = new Subject<PrivateNodeConfig>();
	databaseStats = new Subject<DatabaseStats>();
	receiverStatus = new Subject<ReceiverStatus>();

	constructor(node: PrivateNode) {
		this.node = node;

		this.node.authenticated.subscribe((authenticated) => {
			if (authenticated) {
				this.node.sendControlMessage(['CONTROL', 'LOG', 'SUBSCRIBE']);
				this.node.sendControlMessage(['CONTROL', 'CONFIG', 'SUBSCRIBE']);
				this.node.sendControlMessage(['CONTROL', 'RECEIVER', 'SUBSCRIBE']);
				this.node.sendControlMessage(['CONTROL', 'DATABASE', 'SUBSCRIBE']);
			}
		});

		this.node.onControlResponse.subscribe(this.handleControlResponse.bind(this));
	}

	handleControlResponse(response: ControlResponse) {
		if (response[1] === 'CONFIG' && response[2] === 'CHANGED') {
			this.config.next(response[3]);
		} else if (response[1] === 'DATABASE' && response[2] === 'STATS') {
			this.databaseStats.next(response[3]);
		} else if (response[1] === 'RECEIVER' && response[2] === 'STATUS') {
			this.receiverStatus.next(response[3]);
		} else if (response[1] === 'LOG') {
			switch (response[2]) {
				case 'LINE':
					const newArr = [...this.logs.value, response[3]];
					while (newArr.length >= MAX_LOG_LINES) {
						newArr.shift();
					}
					this.logs.next(newArr);
					break;
				case 'CLEAR':
					this.logs.next([]);
					break;
			}
		}
	}

	send(message: ControlMessage) {
		this.node.send(JSON.stringify(message));
	}

	async setConfigField(field: keyof PrivateNodeConfig, value: any) {
		if (this.config.value === undefined) throw new Error('Config not synced');

		await this.send(['CONTROL', 'CONFIG', 'SET', field, value]);

		return new Promise<PrivateNodeConfig>((res) => {
			const sub = this.config.subscribe((config) => {
				res(config);
				sub.unsubscribe();
			});
		});
	}

	async addExplicitRelay(relay: string | URL) {
		const url = new URL(relay).toString();

		if (this.config.value?.relays.some((r) => r.url === url)) return;

		await this.setConfigField('relays', [...(this.config.value?.relays ?? []), { url }]);
	}
	async removeExplicitRelay(relay: string | URL) {
		await this.setConfigField(
			'relays',
			this.config.value?.relays.filter((r) => r.url !== relay.toString()),
		);
	}
	async addPubkey(pubkey: string) {
		if (this.config.value?.pubkeys.some((p) => p === pubkey)) return;
		await this.setConfigField('pubkeys', [...(this.config.value?.pubkeys ?? []), pubkey]);
	}
	async removePubkey(pubkey: string) {
		await this.setConfigField(
			'pubkeys',
			this.config.value?.pubkeys.filter((p) => p !== pubkey),
		);
	}
}