import useOverviewReport from '../../../hooks/reports/use-overview-report';
import OverviewItem from './overview-item';

export default function OverviewList({}) {
	const overview = useOverviewReport();
	return overview?.map((item) => {
		return <OverviewItem pubkey={item.pubkey} events={item.events} />;
	});
}
