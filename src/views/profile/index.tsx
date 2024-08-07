import { Flex, Heading } from '@chakra-ui/react';

import useParamsProfilePointer from '../../hooks/use-params-pubkey-pointer';
import useUserMetadata from '../../hooks/use-user-metadata';
import UserAvatar from '../../components/user/user-avatar';
import UserName from '../../components/user/user-name';
import UserDnsIdentity from '../../components/user/user-dns-identity';
import UserFollowButton from './components/user-follow-button';

function UserProfilePage({ pubkey }: { pubkey: string }) {
	const metadata = useUserMetadata(pubkey, undefined, { alwaysRequest: true });

	return (
		<Flex w="full">
			<Flex maxW="4xl" w="full" mx="auto" direction="column" p="4">
				<Flex gap="4">
					<UserAvatar pubkey={pubkey} size="xl" />
					<Flex direction="column" overflow="hidden">
						<UserName as={Heading} pubkey={pubkey} isTruncated />
						<UserDnsIdentity pubkey={pubkey} />
					</Flex>
				</Flex>
				<UserFollowButton pubkey={pubkey} ml="auto" />
			</Flex>
		</Flex>
	);
}

export default function UserProfileView() {
	const pointer = useParamsProfilePointer('pointer');

	return <UserProfilePage pubkey={pointer.pubkey} />;
}
