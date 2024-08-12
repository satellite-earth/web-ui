import { Box, ButtonGroup, Flex, Heading, IconButton } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

import useParamsProfilePointer from '../../hooks/use-params-pubkey-pointer';
import useUserMetadata from '../../hooks/use-user-metadata';
import UserAvatar from '../../components/user/user-avatar';
import UserName from '../../components/user/user-name';
import UserDnsIdentity from '../../components/user/user-dns-identity';
import UserFollowButton from './components/user-follow-button';
import UserAbout from '../../components/user/user-about';
import { DirectMessagesIcon } from '../../components/icons';
import { nip19 } from 'nostr-tools';

function UserProfilePage({ pubkey }: { pubkey: string }) {
	const metadata = useUserMetadata(pubkey, undefined, { alwaysRequest: true });

	return (
		<Flex w="full">
			<Flex maxW="4xl" w="full" mx="auto" direction="column" p="4">
				<Box overflow="hidden">
					<UserAvatar pubkey={pubkey} size="xl" float="left" mr="4" mb="2" />
					<UserName as={Heading} pubkey={pubkey} isTruncated />
					<UserDnsIdentity pubkey={pubkey} />
					<UserAbout pubkey={pubkey} />
				</Box>
				<ButtonGroup ml="auto">
					<IconButton
						as={RouterLink}
						to={`/messages/p/${nip19.npubEncode(pubkey)}`}
						icon={<DirectMessagesIcon boxSize={5} />}
						colorScheme="blue"
						aria-label="Message"
					/>
					<UserFollowButton pubkey={pubkey} />
				</ButtonGroup>
			</Flex>
		</Flex>
	);
}

export default function UserProfileView() {
	const pointer = useParamsProfilePointer('pointer');

	return <UserProfilePage pubkey={pointer.pubkey} />;
}
