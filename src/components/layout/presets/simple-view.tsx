import { Flex } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import SimpleHeader from './simple-header';

export default function SimpleView({ children, title }: PropsWithChildren<{ title: string }>) {
	return (
		<Flex flex={1} direction="column" overflow="hidden">
			<SimpleHeader title={title} />

			<Flex direction="column" overflowY="auto" p="4" gap="2">
				{children}
			</Flex>
		</Flex>
	);
}
