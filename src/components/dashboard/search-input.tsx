import { Flex, Input, Button, IconButton, InputGroup, InputRightElement, HStack } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

// TODO get custom/imported icons for this icon buttons
// (just using the check circle icons as a placeholder)
// https://v2.chakra-ui.com/docs/components/icon#using-chakra-ui-icons

export default function SearchInput() {
	return (
		<Flex alignItems="center">
			<InputGroup>
				<Input size="lg" placeholder="Search on your node..." />
				<InputRightElement width="4.5rem" pr="3rem" height="100%">
					<HStack spacing={1}>
						<IconButton aria-label="" size="sm" icon={<CheckCircleIcon />} />
						<IconButton aria-label="" size="sm" icon={<CheckCircleIcon />} />
						<IconButton aria-label="" size="sm" icon={<CheckCircleIcon />} />
					</HStack>
				</InputRightElement>
			</InputGroup>
		</Flex>
	);
}
