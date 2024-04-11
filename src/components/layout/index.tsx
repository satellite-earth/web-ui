import { PropsWithChildren } from 'react';
import { Center, Flex, Heading } from '@chakra-ui/react';

import ErrorBoundary from '../error-boundary';
import ChannelNav from './channel-nav';
import CommunitiesNav from './communities-nav';
import useSubject from '../../hooks/use-subject';
import communitiesService from '../../services/communities';

export default function Layout({ children }: PropsWithChildren) {
	const community = useSubject(communitiesService.community);

	return (
		<>
			<Flex
				direction={{
					base: 'column',
					md: 'row',
				}}
				minH="100vh"
			>
				<CommunitiesNav />
				{community ? (
					<>
						<ChannelNav />
						<Flex direction="column" overflow="hidden" grow={1}>
							<ErrorBoundary>{children}</ErrorBoundary>
						</Flex>
					</>
				) : (
					<Center flex={1}>
						<Heading>Select Community</Heading>
					</Center>
				)}
			</Flex>
		</>
	);
}
