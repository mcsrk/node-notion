/** Params to list own products*/
export interface IFeedbackRange {
	min: number;
	max: number;

	message: string;
	suggestions: string;
	study_resource: { name: string; href: string | null };
}
