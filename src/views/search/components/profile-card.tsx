import { Flex, LinkBox } from '@chakra-ui/react';
import { nip19, NostrEvent } from 'nostr-tools';
import { Link as RouterLink } from 'react-router-dom';

import UserAvatar from '../../../components/user/user-avatar';
import HoverLinkOverlay from '../../../components/hover-link-overlay';
import UserName from '../../../components/user/user-name';
import UserAbout from '../../../components/user/user-about';
import UserDnsIdentity from '../../../components/user/user-dns-identity';

export default function ProfileCard({ profile }: { profile: NostrEvent }) {
	return (
		<Flex
			as={LinkBox}
			direction="column"
			maxW="xs"
			minW="8rem"
			h="8rem"
			flexShrink={0}
			rounded="md"
			borderWidth="1px"
			p="2"
			overflow="hidden"
			gap="2"
		>
			<Flex gap="2">
				<UserAvatar pubkey={profile.pubkey} />
				<Flex direction="column">
					<HoverLinkOverlay as={RouterLink} to={`/profile/${nip19.npubEncode(profile.pubkey)}`} isTruncated>
						<UserName pubkey={profile.pubkey} />
					</HoverLinkOverlay>
					<UserDnsIdentity pubkey={profile.pubkey} />
				</Flex>
			</Flex>
			<UserAbout pubkey={profile.pubkey} noOfLines={2} />
		</Flex>
	);
}
