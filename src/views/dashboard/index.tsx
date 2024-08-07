import { Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { resetPrivateNodeURL } from '../../services/personal-node';
import { controlApi } from '../../services/personal-node';
import useOverviewReport from '../../hooks/reports/use-overview-report';
import useSubject from '../../hooks/use-subject';
import DesktopSideNav from '../../components/layout/desktop/side-nav';
import PanelItemToggle from '../../components/dashboard/panel-item-toggle';
import UserName from '../../components/user/user-name';
import OverviewItem from '../../components/dashboard/overview-item';
import SearchInput from '../../components/dashboard/search-input';

export default function DashboardHomeView() {
	const overview = useOverviewReport();
	const status = useSubject(controlApi?.receiverStatus);
	const config = useSubject(controlApi?.config);

	useEffect(() => {
		console.log('overview-report', overview);
	}, [overview]);

	const [filter, setFilter] = useState('');

	const disconnect = () => {
		if (confirm('Disconnect from personal node?')) {
			resetPrivateNodeURL();
		}
	};

	return (
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
			<Flex minWidth="1000px" flexDirection="column">
				<div style={{ marginBottom: 36 }}>
					<SearchInput />
				</div>
			</Flex>
			<Flex minWidth="720px" flexDirection="column">
				{overview
					?.filter((item) => {
						return !filter || item.pubkey.includes(filter);
					})
					.map((item) => {
						return <OverviewItem pubkey={item.pubkey} events={item.events} />;
					})}
			</Flex>
		</Flex>
	);
}
