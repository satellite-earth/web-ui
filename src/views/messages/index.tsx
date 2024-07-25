import { Outlet, useMatch } from 'react-router-dom';
import { Flex, useBreakpointValue } from '@chakra-ui/react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { ReportResults } from '@satellite-earth/core/types/control-api/reports.js';

import useSubject from '../../hooks/use-subject';
import ConversationButton from './components/conversation-button';
import SimpleHeader from '../../components/simple-header';
import BottomNav from '../../components/layout/mobile/bottom-nav';
import draftService from '../../services/drafts';
import useConversationsReport from '../../hooks/reports/use-conversations-report';

function Conversation({ index, style, data }: ListChildComponentProps<ReportResults['CONVERSATIONS'][]>) {
	const conversation = data[index];

	return (
		<ConversationButton
			pubkey={conversation.pubkey}
			lastReceived={conversation.lastReceived}
			lastSent={conversation.lastSent}
			style={style}
		/>
	);
}

export default function MessagesView() {
	const match = useMatch('/messages');
	const conversations = useConversationsReport();

	useSubject(draftService.onDraftsChange);

	const isMobile = useBreakpointValue({ base: true, lg: false });
	const showMenu = !isMobile || !!match;

	if (showMenu) {
		return (
			<>
				<Flex w="full" overflow="hidden" h="full">
					<Flex
						direction="column"
						w={{ base: 'full', lg: 'md' }}
						overflow={{ base: 'hidden', sm: 'auto' }}
						flexShrink={0}
					>
						<SimpleHeader title="Messages" />
						<Flex h="full" flex={1} overflow="hidden">
							<AutoSizer>
								{({ width, height }) => (
									<FixedSizeList
										height={height}
										width={width}
										itemData={conversations ?? []}
										itemCount={conversations?.length ?? 0}
										itemKey={(i, data) => data[i].pubkey}
										itemSize={64}
									>
										{Conversation}
									</FixedSizeList>
								)}
							</AutoSizer>
						</Flex>
					</Flex>
					<Outlet />
				</Flex>
				<BottomNav />
			</>
		);
	}

	return <Outlet />;
}
