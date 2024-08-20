import { useEffect, useState } from 'react';
import { Button, Code, Text, useToast } from '@chakra-ui/react';

import Panel from '../../../components/dashboard/panel';
import PanelItemString from '../../../components/dashboard/panel-item-string';
import SimpleView from '../../../components/layout/presets/simple-view';
import useSubject from '../../../hooks/use-subject';
import { controlApi } from '../../../services/personal-node';
import { serviceWorkerRegistration } from '../../../services/worker';
import { disableNotifications, enableNotifications, pushSubscription } from '../../../services/notifications';

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
