import { AppendBlockChildrenParameters } from '@notionhq/client/build/src/api-endpoints';
import { ITableRow } from './row/row.interface';

/** References:
 *  https://developers.notion.com/reference/block#keys
 *  https://developers.notion.com/reference/block#table
 *  https://developers.notion.com/reference/patch-block-children
 */
// import { TableBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export interface ITable {
	table: {
		table_width: number;
		children: Array<ITableRow>;
		has_column_header?: boolean;
		has_row_header?: boolean;
	};
	type?: 'table';
	object?: 'block';

	addRow(rowData: any[]): void;
	generateTableRequestBody(): AppendBlockChildrenParameters;
}
