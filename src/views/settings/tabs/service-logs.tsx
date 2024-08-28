import { useEffect, useRef, useState } from 'react';
import { Box, Button, Flex, Select, Spacer, Switch, useDisclosure } from '@chakra-ui/react';
import Convert from 'ansi-to-html';

import useLogsReport from '../../../hooks/reports/use-logs-report';
import useServicesReport from '../../../hooks/reports/use-services-report';
import Timestamp from '../../../components/timestamp';
import SimpleView from '../../../components/layout/presets/simple-view';
import { controlApi } from '../../../services/personal-node';

const convert = new Convert();

export default function ServiceLogsView() {
	const [service, setService] = useState<string | undefined>(undefined);
	const { report, logs } = useLogsReport(service);
	const raw = useDisclosure();

	const scrollBox = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const el = scrollBox.current;
		if (!el) return;

		const rect = el.getBoundingClientRect();

		const closeToBottom = el.scrollTop > el.scrollHeight - rect.height - 128;
		if (closeToBottom || el.scrollTop === 0) {
			el.scrollTo({ top: el.scrollHeight });
		}
	}, [logs]);

	useEffect(() => {
		scrollBox.current?.scrollTo({ top: scrollBox.current.scrollHeight });
	}, [logs?.length]);

	const services = useServicesReport();

	return (
		<SimpleView title="Service Logs">
			<Flex gap="4" alignItems="center">
				<Select
					placeholder="All Services"
					maxW="xs"
					value={service || ''}
					onChange={(e) => setService(e.target.value || undefined)}
				>
					<optgroup label="Services">
						{services?.map((service) => (
							<option key={service.id} value={service.id}>
								{service.id}
							</option>
						))}
					</optgroup>
				</Select>
				<Button
					onClick={() => {
						if (controlApi) {
							controlApi?.send(service ? ['CONTROL', 'LOGS', 'CLEAR', service] : ['CONTROL', 'LOGS', 'CLEAR']);
							report?.clear();
						}
					}}
				>
					Clear
				</Button>
				<Spacer />
				<Switch isChecked={raw.isOpen} onChange={raw.onToggle}>
					Show Raw
				</Switch>
			</Flex>
			<Box overflow="auto" fontFamily="monospace" px="4" pt="2" pb="10" whiteSpace="nowrap" ref={scrollBox}>
				{logs &&
					Array.from(logs)
						.reverse()
						.map((entry) => (
							<p key={entry.timestamp + entry.message}>
								<Timestamp
									timestamp={Math.round(entry.timestamp / 1000)}
									color="blue.500"
									minW="2em"
									display="inline-block"
									userSelect="none"
									mr="2"
								/>
								{raw.isOpen ? (
									entry.message
								) : (
									<span dangerouslySetInnerHTML={{ __html: convert.toHtml(entry.message) }} />
								)}
							</p>
						))}
			</Box>
		</SimpleView>
	);
}
