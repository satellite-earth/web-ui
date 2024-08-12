import { Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { resetPrivateNodeURL } from '../../services/personal-node';
import { controlApi } from '../../services/personal-node';
import useOverviewReport from '../../hooks/reports/use-overview-report';
import useSubject from '../../hooks/use-subject';
import { useBreakpointValue } from '@chakra-ui/react';
import SimpleHeader from '../../components/simple-header';
import MobileBottomNav from '../../components/layout/mobile/bottom-nav';
import PanelItemToggle from '../../components/dashboard/panel-item-toggle';
import UserName from '../../components/user/user-name';
import OverviewItem from '../../components/dashboard/overview-item';

/** @deprecated old dashboard */
export default function DashboardHomeView() {
	const overview = useOverviewReport();
	const status = useSubject(controlApi?.receiverStatus);
	const config = useSubject(controlApi?.config);

	const mobile = useBreakpointValue({ base: true, lg: false });

	const [filter, setFilter] = useState('');

	const disconnect = () => {
		if (confirm('Disconnect from personal node?')) {
			resetPrivateNodeURL();
		}
	};

	return (
		<>
			{mobile ? <SimpleHeader title="Network" /> : null}
			<Flex flexDirection="column" overflow="scroll" w="full" alignItems="center">
				<Flex flexDirection="column" marginBottom="48px" marginTop="24px">
					<div>OWNER: {config?.owner ? <UserName pubkey={config?.owner} /> : <div>NOT SET</div>}</div>
					<PanelItemToggle
						label="LISTENER ACTIVE:"
						value={status?.active ?? false}
						onChange={() => {
							if (status?.active) controlApi?.send(['CONTROL', 'RECEIVER', 'STOP']);
							else controlApi?.send(['CONTROL', 'RECEIVER', 'START']);
						}}
					/>
				</Flex>
				{/* <Flex flexDirection="column" w="full" p="4">
					<div style={{ marginBottom: 36 }}>
						<SearchInput />
					</div>
				</Flex> */}
				<Flex flexDirection="column" w="full">
					{overview
						?.filter((item) => {
							return !filter || item.pubkey.includes(filter);
						})
						.map((item) => {
							return <OverviewItem pubkey={item.pubkey} events={item.events} />;
						})}
				</Flex>
				<MobileBottomNav />
			</Flex>
		</>
	);
}
