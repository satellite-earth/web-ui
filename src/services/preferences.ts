import { Preferences } from '@capacitor/preferences';
import _throttle from 'lodash.throttle';
import { PersistentSubject } from '../classes/subject';
import { nanoid } from 'nanoid';

class Preference<T> extends PersistentSubject<T> {
	key: string;

	constructor(key: string, value: T, saveDefault = false) {
		super(value);
		this.key = key;
		this.value = value;

		// try to load preference
		this.load(saveDefault);
	}

	override next(v: T): void {
		super.next(v);
		this.saveThrottle();
	}

	async load(saveDefault = false) {
		const { value } = await Preferences.get({ key: this.key });

		if (value) {
			this.value = JSON.parse(value) as T;
		} else if (saveDefault) {
			await this.save();
		}
	}

	async remove() {
		await Preferences.remove({ key: this.key });
	}

	saveThrottle = _throttle(this.save.bind(this), 500);
	async save() {
		let value = JSON.stringify(this.value);
		await Preferences.set({ key: this.key, value });
	}
}

// local application preferences
export const ntfyTopic = new Preference('ntfy-topic', '');
export const ntfyServer = new Preference('ntfy-server', 'https://ntfy.sh', true);
