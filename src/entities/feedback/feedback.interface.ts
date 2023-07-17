/** Params to list own products*/
export interface IFeedbackRange {
	range: {
		min: number;
		max: number;
	};
	feedback: {
		special_comment: string;
		strategies: { message: string }[];
	};
}
