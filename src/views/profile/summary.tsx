import { Flex, Heading } from '@chakra-ui/react';

import useParamsProfilePointer from '../../hooks/use-params-pubkey-pointer';
import useUserMetadata from '../../hooks/use-user-metadata';
import useNostrRequest from '../../hooks/use-nostr-request';
import { kinds } from 'nostr-tools';
import NoteCard from '../search/components/note-card';

export default function UserSummaryView() {
	const pointer = useParamsProfilePointer();
	const metadata = useUserMetadata(pointer.pubkey);

	const latestNotes = useNostrRequest([{ kinds: [kinds.ShortTextNote], authors: [pointer.pubkey] }]);

	return (
		<Flex flex={1} direction="column" overflow="hidden" p="4">
			<Heading size="md">Latest notes</Heading>
			{latestNotes.map((note) => (
				<NoteCard key={note.id} event={note} />
			))}
		</Flex>
	);
}
