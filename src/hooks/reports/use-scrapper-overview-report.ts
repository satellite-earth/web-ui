import useReport from '../use-report';
import useSubject from '../use-subject';

export default function useScrapperOverviewReport() {
	const report = useReport('SCRAPPER_OVERVIEW', 'scrapper', {});

	return useSubject(report?.value);
}
