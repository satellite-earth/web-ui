import useReport from '../use-report';
import useSubject from '../use-subject';

export default function useLogsReport(service?: string) {
	const report = useReport('LOGS', `logs-${service || 'all'}`, { service });

	return useSubject(report?.entries);
}
