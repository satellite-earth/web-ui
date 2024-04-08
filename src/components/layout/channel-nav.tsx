import { useState } from 'react';
import {
	Box,
	Button,
	Flex,
	Heading,
	IconButton,
	Image,
	useDisclosure,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { NostrEvent } from 'nostr-tools';

import accountService from '../../services/account';
import useCurrentAccount from '../../hooks/use-current-account';
import UserAvatar from '../user/user-avatar';
import UserName from '../user/user-name';
import useTimelineLoader from '../../hooks/use-timeline-loader';
import useSubject from '../../hooks/use-subject';
import clientRelaysService from '../../services/client-relays';
import { getGroupId, getGroupName } from '../../helpers/nostr/groups';
import { useRelayInfo } from '../../hooks/use-relay-info';
import useCommunityDefinition from '../../hooks/use-community-definition';
import {
	getCommunityBanner,
	getCommunityName,
} from '../../helpers/nostr/communities';
import Plus from '../icons/components/plus';
import CreateGroupModal from '../group/create-channel-modal';
import Edit01 from '../icons/components/edit-01';
import EditChannelModal from '../group/edit-channel-modal';

export default function ChannelNav() {
	const account = useCurrentAccount();
	const createGroupModal = useDisclosure();
	const communityRelay = useSubject(clientRelaysService.community);

	const [editChannel, setEditChannel] = useState<NostrEvent>();

	// load community definition
	const { info } = useRelayInfo(communityRelay);
	const definition = useCommunityDefinition(info?.pubkey);

	// load groups
	const timeline = useTimelineLoader(
		`${communityRelay}-channels`,
		[{ kinds: [39000] }],
		communityRelay,
	);
	const channels = useSubject(timeline.timeline);

	return (
		<Flex
			direction="column"
			gap="2"
			px="2"
			py="2"
			shrink={0}
			w="xs"
			borderRightWidth={1}
		>
			{definition && (
				<Box
					as={RouterLink}
					to="/"
					borderRadius="lg"
					bg="black"
					overflow="hidden"
				>
					{getCommunityBanner(definition) ? (
						<Image
							src={
								getCommunityBanner(definition) ||
								'https://satellite.earth/assets/branding-94b401c7.png'
							}
							w="full"
						/>
					) : (
						<Heading
							color="white"
							mx="4"
							my="1em"
							textAlign="center"
							lineHeight={0}
						>
							{getCommunityName(definition)}
						</Heading>
					)}
				</Box>
			)}
			{account ? (
				<Flex gap="2" alignItems="center">
					<UserAvatar size="sm" pubkey={account.pubkey} />
					<UserName pubkey={account.pubkey} />
					<Button size="sm" onClick={() => accountService.logout()} ml="auto">
						Logout
					</Button>
				</Flex>
			) : (
				<Button as={RouterLink} to="/login" colorScheme="brand" size="sm">
					Login
				</Button>
			)}
			<Flex gap="2" alignItems="center">
				<Heading size="sm">Chat Channels</Heading>
				<IconButton
					icon={<Plus boxSize={5} />}
					aria-label="New Group"
					size="sm"
					ml="auto"
					variant="ghost"
					onClick={createGroupModal.onOpen}
				/>
			</Flex>
			{channels.map((channel) => (
				<Flex gap="1" key={channel.id}>
					<Button
						as={RouterLink}
						to={`/g/${getGroupId(channel)}`}
						size="sm"
						justifyContent="flex-start"
						variant="ghost"
						flex={1}
					>
						{getGroupName(channel)}
					</Button>
					<IconButton
						icon={<Edit01 />}
						aria-label="Edit channel"
						size="sm"
						variant="ghost"
						onClick={() => setEditChannel(channel)}
					/>
				</Flex>
			))}

			{createGroupModal.isOpen && (
				<CreateGroupModal isOpen onClose={createGroupModal.onClose} />
			)}

			{editChannel && (
				<EditChannelModal
					isOpen
					onClose={() => setEditChannel(undefined)}
					channel={editChannel}
				/>
			)}
		</Flex>
	);
}
