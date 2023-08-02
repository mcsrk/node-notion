import { RichTextItemRequest } from '../../rich-text/rich.text';

export interface ITableRow {
	table_row: {
		cells: Array<Array<RichTextItemRequest>>;
	};
}
