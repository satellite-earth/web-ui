import { ReportResults } from '@satellite-earth/core/types/control-api/reports.js';
import Report from '../report';
import Subject from '../subject';

export default class ScrapperOverviewReport extends Report<'SCRAPPER_OVERVIEW'> {
	readonly type = 'SCRAPPER_OVERVIEW';

	value = new Subject<ReportResults['SCRAPPER_OVERVIEW']>();

	handleResult(response: ReportResults['SCRAPPER_OVERVIEW']): void {
		this.value.next(response);
	}
}
