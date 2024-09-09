export interface IDialog {
	extraincomes: boolean;
	extraexpenses: boolean;
}

export interface IUser {
	id: number;
	email: string;
	password_hash: string;
	is_new: boolean;
	is_email_verified: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface IExtraincome {
	id: number;
	user_id: number;
	extraincome_type: string;
	extraincome_amount_monthly: number;
	extraincome_includes_weekends: boolean;
	extraincome_date: Date;
	created_at: Date;
	updated_at: Date;
}

export interface IExtraexpense {
	id: number;
	user_id: number;
	extraexpense_type: string;
	extraexpense_amount_monthly: number;
	extraexpense_date: Date;
	created_at: Date;
	updated_at: Date;
}

export interface IBudget {
	id: number;
	user_id: number;
	currency: string;
	extraincomes: IExtraincome[];
	extraexpenses: IExtraexpense[];
	created_at: Date;
	updated_at: Date;
}

export interface IUserResponse {
	user: IUser;
	budgets: IBudget[];
}

export interface IResponseError {
	statusCode: number;
	error: string;
	message: string;
}

export interface IRootState {
	user: IUser;
	auth: string;
	budget: IBudget;
	budgets: IBudget[];
	dialog: IDialog;
}
