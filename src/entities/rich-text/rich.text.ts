type ColorType =
	| 'default'
	| 'gray'
	| 'brown'
	| 'orange'
	| 'yellow'
	| 'green'
	| 'blue'
	| 'purple'
	| 'pink'
	| 'red'
	| 'gray_background'
	| 'brown_background'
	| 'orange_background'
	| 'yellow_background'
	| 'green_background'
	| 'blue_background'
	| 'purple_background'
	| 'pink_background'
	| 'red_background';

/** This type comes from  */
export type RichTextItemRequest = {
	text: {
		content: string;
		link?: {
			url: string;
		} | null;
	};
	type: 'text';
	annotations?: {
		bold?: boolean;
		italic?: boolean;
		strikethrough?: boolean;
		underline?: boolean;
		code?: boolean;
		color?: ColorType;
	};
};

export type RichTextConstructor = {
	content: string;
	bold: boolean;
	color?: ColorType;
	href?: string;
};

export class RichTextItem implements RichTextItemRequest {
	text: {
		content: string;
		link?: {
			url: string;
		} | null;
	};
	type: 'text';
	annotations?: {
		bold?: boolean;
		italic?: boolean;
		strikethrough?: boolean;
		underline?: boolean;
		code?: boolean;
		color?: ColorType;
	};

	constructor(richTextData: RichTextConstructor) {
		const { content, href, bold, color } = richTextData;
		this.text = { content, link: href ? { url: href } : null };
		this.type = 'text';
		this.annotations = { bold, color };
	}
}
