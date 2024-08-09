import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Card, CardBody, CardHeader, Flex, IconButton, Input, LinkBox, Text } from '@chakra-ui/react';
import { kinds, nip19, NostrEvent } from 'nostr-tools';
import { SearchIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';

import personalNode from '../../services/personal-node';
import userMetadataService from '../../services/user-metadata';
import UserAvatar from '../../components/user/user-avatar';
import UserName from '../../components/user/user-name';
import HoverLinkOverlay from '../../components/hover-link-overlay';
import UserDnsIdentity from '../../components/user/user-dns-identity';
import { ChevronRightIcon } from '../../components/icons';
import Timestamp from '../../components/timestamp';
import UserAbout from '../../components/user/user-about';

export default function SearchView() {
	const [search, setSearch] = useSearchParams();
	const { register, handleSubmit, formState } = useForm({
		defaultValues: { query: search.get('q') ?? '' },
		mode: 'all',
	});

	const [profiles, setProfiles] = useState<NostrEvent[]>([]);
	const [events, setEvents] = useState<NostrEvent[]>([]);

	const submit = handleSubmit((values) => {
		const newSearch = new URLSearchParams(search);
		newSearch.set('q', values.query);
		setSearch(newSearch);
	});

	useEffect(() => {
		const query = search.get('q');
		if (!query || query.length < 3) return;

		setProfiles([]);
		const profileSearch = personalNode?.subscribe([{ kinds: [kinds.Metadata], search: query }], {
			onevent: (event) => {
				userMetadataService.handleEvent(event).value;
				setProfiles((arr) => [...arr, event]);
			},
			oneose: () => {
				if (profileSearch) profileSearch.close();
			},
		});

		setEvents([]);
		const sub = personalNode?.subscribe([{ kinds: [kinds.ShortTextNote], search: query }], {
			onevent: (event) => {
				setEvents((arr) => [...arr, event]);
			},
			oneose: () => {
				if (sub) sub.close();
			},
		});
	}, [search]);

	return (
		<Flex w="full" direction="column" overflowY={{ base: 'auto', md: 'hidden' }}>
			<Flex maxW="4xl" w="full" mx="auto" as="form" onSubmit={submit} pt="4" px="4" gap="2" direction="column">
				<Flex gap="2">
					<Input
						type="search"
						{...register('query', { required: true, minLength: 3 })}
						isRequired
						minLength={3}
						size="lg"
						placeholder="Search your node"
					/>
					<IconButton
						type="submit"
						icon={<SearchIcon boxSize={5} />}
						aria-label="Search"
						size="lg"
						colorScheme="brand"
						isLoading={formState.isSubmitting}
					/>
				</Flex>
				{formState.isSubmitSuccessful && (
					<Text>
						Found {profiles.length} users and {events.length} events
					</Text>
				)}
			</Flex>

			<Flex w="full" overflowY="auto" pb="10">
				<Flex maxW="4xl" w="full" mx="auto" direction="column" gap="4">
					<Flex overflowX="auto" overflowY="hidden" gap="2" p="4" as={LinkBox} flexShrink={0}>
						{profiles.map((event) => (
							<Flex
								key={event.pubkey}
								as={LinkBox}
								direction="column"
								maxW="xs"
								minW="8rem"
								h="8rem"
								flexShrink={0}
								rounded="md"
								borderWidth="1px"
								p="2"
								overflow="hidden"
								gap="2"
							>
								<Flex gap="2">
									<UserAvatar pubkey={event.pubkey} />
									<Flex direction="column">
										<HoverLinkOverlay as={RouterLink} to={`/profile/${nip19.npubEncode(event.pubkey)}`} isTruncated>
											<UserName pubkey={event.pubkey} />
										</HoverLinkOverlay>
										<UserDnsIdentity pubkey={event.pubkey} />
									</Flex>
								</Flex>
								<UserAbout pubkey={event.pubkey} noOfLines={2} />
							</Flex>
						))}
					</Flex>

					{events.map((event) => (
						<Card key={event.id} as={LinkBox}>
							<CardHeader alignItems="center" display="flex" gap="2" pb="2">
								<UserAvatar pubkey={event.pubkey} size="sm" />
								<UserName pubkey={event.pubkey} />
								<Timestamp timestamp={event.created_at} />
								<ChevronRightIcon boxSize={6} ml="auto" />
							</CardHeader>
							<CardBody pt="0" display="flex">
								<Text noOfLines={3} whiteSpace="pre-wrap">
									{event.content}
								</Text>
							</CardBody>
							<HoverLinkOverlay href={`https://nostrapp.link/${nip19.neventEncode(event)}`} target="_blank" />
						</Card>
					))}
				</Flex>
			</Flex>
		</Flex>
	);
}
