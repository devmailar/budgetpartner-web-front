export type TError = {
	errorMessage: string;
};

export type TUser = {
	id: number;
	email: string;
	password_hash: string;
	is_new: boolean;
	created_at: Date;
	update_at: Date;
};

export type TBudget = {
	user_id: number;
	income_amount_total: number;
	income_amount_monthly: number;
	created_at: Date;
	updated_at: Date;
};

export type TBudgetExtraincome = {
	user_id: number;
	income_type: string;
	income_amount_monthly: number;
	created_at: Date;
	updated_at: Date;
};

export type TBudgetRecurringexpense = {
	user_id: number;
	expense_type: string;
	expense_amount_monthly: number;
	created_at: Date;
	updated_at: Date;
};

export type TMenu = {
	addExtraincome: boolean;
	addRecurringexpense: boolean;
	addSavings: boolean;
};

export interface IRootState {
	error: TError;
	user: TUser;
	budget: TBudget;
}
