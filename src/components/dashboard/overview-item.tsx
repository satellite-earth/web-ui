import { Flex } from '@chakra-ui/react';
import UserName from '../user/user-name';
import UserAvatar from '../user/user-avatar';

export default function OverviewItem({ pubkey, events }: { pubkey: string; events: number }) {
	return (
		<Flex
			justifyContent="space-between"
			alignItems="center"
			style={{
				marginBottom: 12,
			}}
		>
			<Flex alignItems="center">
				<UserAvatar pubkey={pubkey} style={{ marginRight: 12 }} />
				<UserName pubkey={pubkey} />
			</Flex>
			<div>{events} events</div>
		</Flex>
	);
}
