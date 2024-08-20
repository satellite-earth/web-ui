import { Button, Flex, FormControl, FormLabel, Heading, Input } from '@chakra-ui/react';

import SimpleHeader from '../../../components/layout/presets/simple-header';
import personalNode, { resetPrivateNodeURL } from '../../../services/personal-node';
import SimpleView from '../../../components/layout/presets/simple-view';

function NodeInfoSettingsPage() {
	const disconnect = () => {
		if (confirm('Disconnect from personal node?')) {
			resetPrivateNodeURL();
		}
	};

	return (
		<>
			<FormControl>
				<FormLabel>Node URL</FormLabel>
				<Flex gap="2">
					<Input readOnly value={personalNode!.url} maxW="xs" />
					<Button isDisabled>Change</Button>
				</Flex>
				<Button variant="link" colorScheme="red" mt="2" onClick={disconnect}>
					disconnect
				</Button>
			</FormControl>
		</>
	);
}

export default function NodeInfoSettingsView() {
	return (
		<SimpleView title="Node info">
			{personalNode ? <NodeInfoSettingsPage /> : <Heading>Missing personal node connection</Heading>}
		</SimpleView>
	);
}
