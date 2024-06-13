export type TUser = {
	id: number;
	email: string;
	password_hash: string;
	created_at: Date;
	update_at: Date;
};

export type TBudget = {
	telegram_id: string;
	income_amount_total: number;
	income_amount_monthly: number;
	created_at: Date;
};

export type TBudgetExtraincome = {
	telegram_id: string;
	income_type: string;
	income_amount_monthly: number;
	created_at: Date;
};

export type TBudgetRecurringexpense = {
	telegram_id: string;
	expense_type: string;
	expense_amount_monthly: number;
	created_at: Date;
};

export type TMenu = {
	addExtraincome: boolean;
	addRecurringexpense: boolean;
	addSavings: boolean;
};
