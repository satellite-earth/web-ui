import { Flex, Heading, SimpleGrid } from '@chakra-ui/react';

import useParamsProfilePointer from '../../hooks/use-params-pubkey-pointer';
import useUserMetadata from '../../hooks/use-user-metadata';
import useNostrRequest from '../../hooks/use-nostr-request';
import { kinds, nip10 } from 'nostr-tools';
import NoteCard from '../search/components/note-card';

export default function UserSummaryView() {
	const pointer = useParamsProfilePointer();
	const metadata = useUserMetadata(pointer.pubkey);

	const latestNotes = useNostrRequest([{ kinds: [kinds.ShortTextNote], authors: [pointer.pubkey], limit: 20 }]);
	const latestRootNotes = latestNotes.filter((note) => !nip10.parse(note).reply);

	return (
		<Flex flex={1} direction="column" overflow="hidden" p="4">
			<Heading size="md">Latest notes</Heading>
			<SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} spacing="4">
				{latestRootNotes.slice(0, 4).map((note) => (
					<NoteCard key={note.id} event={note} />
				))}
			</SimpleGrid>
		</Flex>
	);
}
