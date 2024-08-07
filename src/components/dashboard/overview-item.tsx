import { Flex, LinkBox } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { nip19 } from 'nostr-tools';

import UserName from '../user/user-name';
import UserAvatar from '../user/user-avatar';
import HoverLinkOverlay from '../hover-link-overlay';

export default function OverviewItem({ pubkey, events }: { pubkey: string; events: number }) {
	return (
		<Flex as={LinkBox} justifyContent="space-between" alignItems="center" py="2" px="4">
			<Flex alignItems="center" gap="3">
				<UserAvatar pubkey={pubkey} />
				<HoverLinkOverlay as={RouterLink} to={`/profile/${nip19.npubEncode(pubkey)}`}>
					<UserName pubkey={pubkey} />
				</HoverLinkOverlay>
			</Flex>
			<div>{events} events</div>
		</Flex>
	);
}
