export interface IUser {
	uuid: string;
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
	uuid: string;
	budget_uuid: string;
	type: string;
	amount_monthly: number;
	includes_weekends: boolean;
	date: Date;
	created_at: Date;
	updated_at: Date;
}

export interface IExtraexpense {
	id: number;
	uuid: string;
	budget_uuid: string;
	type: string;
	amount_monthly: number;
	date: Date;
	created_at: Date;
	updated_at: Date;
}

export interface IBudget {
	id: number;
	uuid: string;
	user_uuid: string;
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
