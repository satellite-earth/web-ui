import { Flex, Input, useBreakpointValue } from '@chakra-ui/react';

import BottomNav from '../../components/layout/mobile/bottom-nav';

export default function HomeView() {
	const mobile = useBreakpointValue({ base: true, md: false });

	if (!mobile) {
		return (
			<>
				<Flex overflow="auto" h="full" w="full" alignItems="center" justifyContent="center" direction="column">
					<Input maxWidth="600" placeholder="Search your network..." p="4" />
				</Flex>
				<BottomNav />
			</>
		);
	}

	return null;
}
