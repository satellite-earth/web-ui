import { Flex, FlexProps } from '@chakra-ui/react';

import SimpleHeader from './simple-header';

export default function SimpleView({ children, title, as }: FlexProps) {
	return (
		<Flex
			as={as}
			flex={1}
			direction="column"
			overflow="hidden"
			// handle native notch and navbar
			pr="env(safe-area-inset-right)"
			pl="env(safe-area-inset-left)"
		>
			<SimpleHeader title={title} />

			<Flex
				direction="column"
				overflowY="auto"
				px="4"
				pt="4"
				pb="max(1rem, env(safe-area-inset-bottom))"
				gap="2"
				flexGrow={1}
			>
				{children}
			</Flex>
		</Flex>
	);
}
