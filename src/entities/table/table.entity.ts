// Custom library
import { AppendBlockChildrenParameters, BlockObjectRequest } from '@notionhq/client/build/src/api-endpoints';

// Interfaces
import { ITable } from './table.interface';
import { ITableRow } from './row/row.interface';
import { TableRow } from './row/row.entity';

// Entities
import { RichTextConstructor } from '../rich-text/rich.text';

import Logging from '../../library/Logging';

const TAG = '[Table]';

export class Table implements ITable {
	maxRows: number | undefined;
	//-----------
	parent_id: string;
	table: {
		table_width: number;
		has_column_header?: boolean;
		has_row_header?: boolean;
		children: Array<ITableRow>;
	};
	type?: 'table';
	object?: 'block';

	constructor(parentId: string, headerCols: RichTextConstructor[][], maxRows?: number) {
		if (!headerCols.length) {
			throw new Error(`${TAG} Table must have at least 1 column, instead found ${headerCols.length} cols `);
		}

		const _newRow = new TableRow(headerCols);

		this.parent_id = parentId;
		this.type = 'table';
		this.object = 'block';
		this.table = {
			has_column_header: true,
			has_row_header: false,
			table_width: headerCols.length,
			children: [_newRow],
		};

		if (maxRows) {
			this.maxRows = maxRows;
		}
	}

	addRow(rowData: RichTextConstructor[][]): void {
		if (rowData.length !== this.table.table_width) {
			throw new Error(
				`${TAG} Row added mismatch the columns (${rowData.length}) of the table(${this.table.table_width}) `,
			);
		}
		if (this.maxRows && this.table.children.length === this.maxRows) {
			Logging.warning(`${TAG} Max rows reached (${this.maxRows})`);
		} else {
			this.table.children.push(new TableRow(rowData));
		}
	}

	generateTableRequestBody(): AppendBlockChildrenParameters {
		return {
			block_id: this.parent_id,
			children: [
				{
					object: this.object,
					type: this.type,
					table: this.table,
				},
			],
		};
	}
	generateBlockRequestBody(): BlockObjectRequest {
		return {
			object: this.object,
			type: this.type,
			table: this.table,
		};
	}
}
