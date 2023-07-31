import { ITableRow, RichTextItemRequest } from './row.interface';

export class TableRow implements ITableRow {
	table_row: {
		cells: Array<Array<RichTextItemRequest>>;
	};
	constructor(cells: Array<string>) {
		const _cells: RichTextItemRequest[][] = cells.map((colContent) => {
			const textElementsWithinACol: Array<RichTextItemRequest> = [
				{
					type: 'text',
					text: {
						content: colContent,
					},
				},
			];
			return textElementsWithinACol;
		});

		this.table_row = { cells: _cells };
	}
}
