import { PropsWithChildren, Suspense, useEffect, useState } from 'react';
import { Button, ChakraProvider, Code, Flex, Spinner, useForceUpdate, useInterval } from '@chakra-ui/react';
import ErrorBoundary from './components/error-boundary';
import { RouterProvider, createHashRouter } from 'react-router-dom';

import './styles.css';

import LoginView from './views/login';
import LoginStartView from './views/login/start';
import AppLayout from './components/layout';
import LoginNsecView from './views/login/nsec';
import { theme } from './theme';
import { ChannelView } from './views/channel';
import { GlobalProviders } from './providers';
import ConnectView from './views/connect';
import privateNode, { resetPrivateNodeURL } from './services/private-node';

function InitialConnection({ children }: PropsWithChildren) {
	const mode = 'private';

	const update = useForceUpdate();
	useInterval(update, 100);

	const [done, setDone] = useState(false);
	useEffect(() => {
		if (!done && privateNode?.connected) setDone(true);
	}, [privateNode?.connected, done]);

	if (done) return <>{children}</>;

	if (mode === 'private') {
		if (!privateNode) return <ConnectView />;

		if (!privateNode.connected)
			return (
				<Flex alignItems="center" justifyContent="center" gap="2" direction="column" h="full" w="full">
					<Flex gap="4" alignItems="center">
						<Spinner /> Connecting...
					</Flex>
					<Code>{privateNode.url}</Code>

					<Button variant="link" onClick={resetPrivateNodeURL}>
						Cancel
					</Button>
				</Flex>
			);
	}

	return <>{children}</>;
}

const router = createHashRouter([
	{
		path: 'login',
		element: <LoginView />,
		children: [
			{ path: '', element: <LoginStartView /> },
			{ path: 'nsec', element: <LoginNsecView /> },
		],
	},
	{
		path: '',
		element: <AppLayout />,
		children: [{ path: 'g/:id', element: <ChannelView /> }],
	},
]);

const App = () => (
	<ErrorBoundary>
		<ChakraProvider theme={theme}>
			<GlobalProviders>
				<InitialConnection>
					<Suspense fallback={<h1>Loading...</h1>}>
						<RouterProvider router={router} />
					</Suspense>
				</InitialConnection>
			</GlobalProviders>
		</ChakraProvider>
	</ErrorBoundary>
);

export default App;
