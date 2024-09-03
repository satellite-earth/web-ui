import { Flex, FlexProps } from '@chakra-ui/react';

import SimpleHeader from './simple-header';

export default function SimpleView({ children, title, as }: FlexProps) {
	return (
		<Flex as={as} flex={1} direction="column" overflow="hidden">
			<SimpleHeader title={title} />

			<Flex direction="column" overflowY="auto" p="4" gap="2">
				{children}
			</Flex>
		</Flex>
	);
}
