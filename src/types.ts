export interface IUser {
	id: number;
	email: string;
	password_hash: string;
	is_new: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface IExtraincome {
	id: number;
	user_id: number;
	extraincome_type: string;
	extraincome_amount_monthly: number;
	created_at: Date;
	updated_at: Date;
}

export interface IExtraexpense {
	id: number;
	user_id: number;
	extraexpense_type: string;
	extraexpense_amount_monthly: number;
	created_at: Date;
	updated_at: Date;
}

export interface IBudget {
	id: number;
	user_id: number;
	extraincomes: IExtraincome[];
	extraexpenses: IExtraexpense[];
	created_at: Date;
	updated_at: Date;
}

export interface IUserResponse {
	user: IUser;
	budgets: IBudget[];
}

export interface IModals {
	extraincome: boolean;
	extraexpense: boolean;
	language: boolean;
	settings: boolean;
}

export interface IRootState {
	user: IUser;
	budget: IBudget;
	budgets: IBudget[];
	modals: IModals;
	error: string;
	language: string;
	forceLogin: boolean;
}

export interface IResponseError {
	statusCode: number;
	error: string;
	message: string;
}
