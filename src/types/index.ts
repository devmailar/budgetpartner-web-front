export interface IUser {
	id: number;
	email: string;
	email_verification_token: string;
	password_hash: string;
	is_new: boolean;
	is_email_verified: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface IExtraincome {
	id: number;
	user_id: number;
	type: string;
	amount_monthly: number;
	includes_weekends: boolean;
	date: Date;
	created_at: Date;
	updated_at: Date;
}

export interface IExtraexpense {
	id: number;
	user_id: number;
	type: string;
	amount_monthly: number;
	date: Date;
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
	message: string;
	error: string;
	statusCode: number;
}

export interface IRootState {
	user: IUser;
	auth: string;
	budget: IBudget;
	budgets: IBudget[];
}
