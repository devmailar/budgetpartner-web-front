export type TUser = {
	id: number;
	email: string;
	password_hash: string;
	is_new: boolean;
	created_at: Date;
	update_at: Date;
};

export type TBudget = {
	id: number;
	user_id: number;
	created_at: Date;
	updated_at: Date;
	extraincomes: TExtraincome[];
	extraexpenses: TExtraexpense[];
};

export type TExtraincome = {
	user_id: number;
	extraincome_type: string;
	extraincome_amount_monthly: number;
	created_at: Date;
	updated_at: Date;
};

export type TExtraexpense = {
	user_id: number;
	extraexpense_type: string;
	extraexpense_amount_monthly: number;
	created_at: Date;
	updated_at: Date;
};

export type TMenu = {
	addExtraincome: boolean;
	addRecurringexpense: boolean;
	addSavings: boolean;
};

export type TModal = {
	extraincomeModal: boolean;
	recurringexpenseModal: boolean;
	incomeModal: boolean;
	incomeModalEdit: boolean;
};

export interface IUserResponse {
	user: TUser;
	budgets: TBudget[];
}

export interface IRootState {
	error: string;
	user: TUser;
	budget: TBudget;
	extraincomes: TExtraincome[];
	recurringexpenses: TRecurringexpense[];
	modal: TModal;
}

export interface IErrorResponse {
	statusCode: number;
	error: string;
	message: string;
}

export enum Period {
	DAY = "DAY",
	MONTH = "MONTH",
	YEAR = "YEAR",
}
