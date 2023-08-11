import { RichTextConstructor, RichTextItem, RichTextItemRequest } from '../../rich-text/rich.text';
import { ITableRow } from './row.interface';

export class TableRow implements ITableRow {
	table_row: {
		cells: Array<Array<RichTextItemRequest>>;
	};
	constructor(cells: RichTextConstructor[][]) {
		const _cells: RichTextItemRequest[][] = cells.map((colContent) => {
			const textElementsWithinACol: Array<RichTextItemRequest> = colContent.map((textItem: RichTextConstructor) => {
				return new RichTextItem(textItem);
			});

			return textElementsWithinACol;
		});

		this.table_row = { cells: _cells };
	}
}
