import { Card, CardBody, CardHeader, Flex, Text, useDisclosure } from '@chakra-ui/react';
import UserAvatar from '../../../components/user/user-avatar';
import UserName from '../../../components/user/user-name';
import Timestamp from '../../../components/timestamp';
import { ConversationResult } from '../../../classes/reports/dm-search';
import useCurrentAccount from '../../../hooks/use-current-account';
import { ChevronDownIcon, ChevronRightIcon } from '../../../components/icons';

export default function ConversationCard({ conversation }: { conversation: ConversationResult }) {
	const account = useCurrentAccount();
	const expanded = useDisclosure();

	const other = conversation.pubkeys.find((p) => p !== account?.pubkey)!;

	const lastMessageAt = conversation.results.reduce((min, result) => Math.min(result.event.created_at), Infinity);

	return (
		<Card>
			<CardHeader alignItems="center" display="flex" gap="2" onClick={expanded.onToggle} cursor="pointer">
				<UserAvatar pubkey={other} size="sm" />
				<UserName pubkey={other} />
				<Text>{conversation.results.length} messages</Text>
				<Timestamp timestamp={lastMessageAt} ml="auto" />
				{expanded.isOpen ? <ChevronDownIcon boxSize={6} /> : <ChevronRightIcon boxSize={6} />}
			</CardHeader>
			{expanded.isOpen && (
				<CardBody pt="0" display="flex" gap="2" flexDirection="column">
					{conversation.results.map((result) => (
						<Flex gap="2">
							<UserName pubkey={result.event.pubkey} />
							<Text noOfLines={3} whiteSpace="pre-wrap">
								{result.plaintext}
							</Text>
							<Timestamp timestamp={result.event.created_at} ml="auto" />
						</Flex>
					))}
				</CardBody>
			)}
		</Card>
	);
}
