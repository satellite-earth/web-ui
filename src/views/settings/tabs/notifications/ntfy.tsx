import { useEffect, useState } from 'react';
import { Button, Code, Flex, Heading, Link, Spinner, Text } from '@chakra-ui/react';
import { useLocalStorage } from 'react-use';
import { nanoid } from 'nanoid';
import { kinds, NostrEvent } from 'nostr-tools';

import personalNode, { controlApi } from '../../../../services/personal-node';
import useCurrentAccount from '../../../../hooks/use-current-account';

export default function NtfyNotificationSettings() {
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

	if (!topic) return <Spinner />;

	return (
		<>
			<Flex alignItems="center" gap="2">
				<Heading size="md">Ntfy Notifications</Heading>
				<Link isExternal href="https://ntfy.sh/" color="GrayText" ml="auto">
					More Info
				</Link>
			</Flex>

			<Text>
				Ntfy notifications use an external app to send notifications to your device. you can find instructions on
				setting up the app{' '}
				<Link color="blue.500" isExternal href="https://ntfy.sh/">
					here
				</Link>
			</Text>

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
