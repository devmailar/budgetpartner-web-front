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

export type TExtraincome = {
	user_id: number;
	extraincome_type: string;
	extraincome_amount_monthly: number;
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

export type TModal = {
	extraincomeModal: boolean;
	recurringexpensesModal: boolean;
	incomeModalEdit: boolean;
};

export interface IRootState {
	error: string;
	user: TUser;
	budget: TBudget;
	modal: TModal;
}

export interface IErrorResponse {
	statusCode: number;
	error: string;
	message: string;
}
