import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Code, Flex, Link, Spinner, Text, useToast } from '@chakra-ui/react';
import { useLocalStorage } from 'react-use';
import { nanoid } from 'nanoid';

import Panel from '../../../components/dashboard/panel';
import PanelItemString from '../../../components/dashboard/panel-item-string';
import SimpleView from '../../../components/layout/presets/simple-view';
import useSubject from '../../../hooks/use-subject';
import personalNode, { controlApi } from '../../../services/personal-node';
import { serviceWorkerRegistration } from '../../../services/worker';
import { disableNotifications, enableNotifications, pushSubscription } from '../../../services/web-push-notifications';
import { CAP_IS_NATIVE } from '../../../env';
import { kinds, NostrEvent } from 'nostr-tools';
import useCurrentAccount from '../../../hooks/use-current-account';

function NtfySettings() {
	const account = useCurrentAccount();
	const [topic, setTopic] = useLocalStorage<string>('ntfy-topic', '', { raw: true });
	useEffect(() => {
		if (!topic) setTopic(nanoid());
	}, [topic]);

	const [testing, setTesting] = useState(false);
	const test = async () => {
		if (!account) return;
		setTesting(true);

		const events: NostrEvent[] = [];
		await new Promise<void>((res) => {
			const sub = personalNode?.subscribe(
				[{ kinds: [kinds.EncryptedDirectMessage], limit: 10, '#p': [account.pubkey] }],
				{
					onevent: (event) => {
						events.push(event);
					},
					oneose: () => {
						const random = events[Math.round((events.length - 1) * Math.random())];
						controlApi?.send(['CONTROL', 'NOTIFICATIONS', 'NOTIFY', random.id]);
						res();
					},
				},
			);
		});

		setTesting(false);
	};

	// if(!CAP_IS_NATIVE) return null
	if (!topic) return <Spinner />;

	return (
		<>
			<Text>Ntfy Topic (Work in progress)</Text>
			<Code p="2" userSelect="all">
				{topic}
			</Code>
			<Flex gap="2" mt="2">
				<Button
					onClick={() =>
						controlApi?.send([
							'CONTROL',
							'NOTIFICATIONS',
							'REGISTER',
							{ id: `ntfy:${topic}`, server: 'https://ntfy.sh', topic, type: 'ntfy', deviceType: 'mobile' },
						])
					}
					colorScheme="blue"
				>
					Enable
				</Button>
				<Button
					onClick={() => controlApi?.send(['CONTROL', 'NOTIFICATIONS', 'UNREGISTER', `ntfy:${topic}`])}
					colorScheme="orange"
				>
					Disable
				</Button>
				<Button as={Link} href={`ntfy://ntfy.sh/${topic}`} colorScheme="green" isExternal>
					Setup Ntfy
				</Button>
				<Button ml="auto" onClick={test} isLoading={testing}>
					Test
				</Button>
			</Flex>
		</>
	);
}

function NotificationSettings() {
	const toast = useToast();

	useEffect(() => {
		controlApi?.send(['CONTROL', 'NOTIFICATIONS', 'GET-VAPID-KEY']);
	}, []);

	const registration = useSubject(serviceWorkerRegistration);
	const subscription = useSubject(pushSubscription);

	const [loading, setLoading] = useState(false);
	const toggle = async () => {
		setLoading(true);
		try {
			if (!subscription) await enableNotifications();
			else await disableNotifications();
		} catch (error) {
			if (error instanceof Error) toast({ status: 'error', description: error.message });
		}
		setLoading(false);
	};

	return (
		<>
			{subscription ? (
				<>
					<Code whiteSpace="pre" overflow="auto" p="2" mb="2">
						{JSON.stringify(subscription?.toJSON(), null, 2)}
					</Code>
					<Button colorScheme="red" isLoading={loading} onClick={toggle}>
						Disable Notifications
					</Button>
				</>
			) : (
				<Button
					colorScheme="green"
					isLoading={loading}
					onClick={toggle}
					isDisabled={!registration || subscription === undefined}
				>
					Enable Notifications
				</Button>
			)}
			{!registration && (
				<Text color="orange" py="2">
					Service Worker unsupported
				</Text>
			)}

			<NtfySettings />
		</>
	);
}

export default function NotificationSettingsView() {
	const vapidKey = useSubject(controlApi?.vapidKey);

	return (
		<SimpleView title="Notifications">
			<Panel label="Notifications Config" maxW="2xl">
				<PanelItemString label="VAPID public key" value={vapidKey || 'NONE'} qr />
			</Panel>

			<Panel label="Device Settings" maxW="2xl">
				<NotificationSettings />
			</Panel>
		</SimpleView>
	);
}
