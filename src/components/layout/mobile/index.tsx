import { useEffect } from 'react';
import { Flex, Heading, IconButton, useDisclosure } from '@chakra-ui/react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { HamburgerIcon, SearchIcon } from '@chakra-ui/icons';
import { getCommunityName } from '@satellite-earth/core/helpers/nostr';

import useSubject from '../../../hooks/use-subject';
import communitiesService from '../../../services/communities';
import ExploreCommunitiesModal from '../../explore/expore-communities-modal';
import DrawerNav from './drawer-nav';
import NotificationsPrompt from '../notifications-prompt';
import ConnectionStatus from '../connection-status';

export default function MobileLayout() {
	const drawer = useDisclosure();
	const explore = useDisclosure();
	const location = useLocation();

	const community = useSubject(communitiesService.community);

	// close the drawer when a community is selected
	useEffect(() => {
		drawer.onClose();
	}, [community, drawer.onClose]);

	// TODO: move this header to a better place
	if (location.pathname === '/') {
		return (
			<>
				<ConnectionStatus />
				<NotificationsPrompt />
				<Flex alignItems="center" justifyContent="space-between" borderBottomWidth={1}>
					<Flex alignItems="center" gap="4" p="2">
						<IconButton
							icon={<HamburgerIcon boxSize={5} />}
							aria-label="Show Menu"
							variant="ghost"
							onClick={drawer.onOpen}
						/>
						<Heading as="h1" size="md">
							{community ? getCommunityName(community) : 'Satellite'}
						</Heading>
					</Flex>
					<IconButton
						icon={<SearchIcon boxSize={5} />}
						aria-label="Search"
						variant="ghost"
						p="4"
						//onClick={drawer.onOpen}
					/>
				</Flex>
				<Outlet />
				<DrawerNav isOpen={drawer.isOpen} onClose={drawer.onClose} />
				{explore.isOpen && <ExploreCommunitiesModal isOpen onClose={explore.onClose} />}
			</>
		);
	}

	return (
		<>
			<ScrollRestoration />
			<ConnectionStatus />
			<NotificationsPrompt />
			<Outlet />
		</>
	);
}
