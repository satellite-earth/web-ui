import { Flex, IconButton, Input } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import MobileBottomNav from '../../components/layout/mobile/bottom-nav';
import { ChevronRightIcon } from '../../components/icons';

export default function HomeView() {
	const navigate = useNavigate();
	const { register, handleSubmit } = useForm({ defaultValues: { query: '' } });

	const submit = handleSubmit((values) => {
		navigate('/search?q=' + values.query);
	});

	return (
		<>
			<Flex
				overflow="auto"
				h="full"
				w="full"
				alignItems="center"
				justifyContent={{ base: 'flex-start', md: 'center' }}
				gap="2"
				direction="column"
			>
				<Flex as="form" gap="2" w="full" p="4" mt="40" maxW="xl" onSubmit={submit}>
					<Input placeholder="Search your network..." p="4" {...register('query', { required: true })} isRequired />
					<IconButton type="submit" icon={<ChevronRightIcon boxSize={6} />} aria-label="Search" colorScheme="brand" />
				</Flex>
			</Flex>
			<MobileBottomNav />
		</>
	);
}
