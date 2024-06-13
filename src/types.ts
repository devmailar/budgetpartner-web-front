export type TUser = {
	telegram_id: string;
	first_name: string;
	new: boolean;
	created_at: Date;
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
