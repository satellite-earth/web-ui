import { Button, Divider, Flex, Text } from '@chakra-ui/react';
import { Outlet, useMatch, Link as RouterLink } from 'react-router-dom';

import SimpleHeader from '../../components/layout/presets/simple-header';
import { useBreakpointValue } from '../../providers/global/breakpoint-provider';

export default function SettingsView() {
	const match = useMatch('/settings');
	const isMobile = useBreakpointValue({ base: true, lg: false });
	const showMenu = !isMobile || !!match;

	if (showMenu) {
		return (
			<Flex overflow="hidden" flex={1} direction={{ base: 'column', lg: 'row' }}>
				<Flex overflowY="auto" overflowX="hidden" h="full" minW="xs" direction="column">
					<SimpleHeader title="Settings" />
					<Flex direction="column" p="2" gap="2">
						<Button as={RouterLink} to="/settings/display" variant="ghost">
							Display
						</Button>
						<Button as={RouterLink} to="/settings/notifications" variant="ghost">
							Notifications
						</Button>
						<Flex alignItems="center" gap="2">
							<Divider />
							<Text fontWeight="bold" fontSize="md">
								Node
							</Text>
							<Divider />
						</Flex>
						<Button as={RouterLink} to="/settings/node-info" variant="ghost">
							Node Info
						</Button>
					</Flex>
				</Flex>
				{!isMobile && <Outlet />}
			</Flex>
		);
	}

	return <Outlet />;
}
