import Dexie, { type EntityTable } from "dexie";

export interface BudgetTable {
	id: number;
	user_id: number;
	currency: string;

	created_at: Date;
	updated_at: Date;
}

export interface ExtraincomeTable {
	id: number;
	budget_id: number;

	extraincome_type: string;
	extraincome_amount_monthly: number;
	extraincome_includes_weekends: boolean;
	extraincome_date: Date;

	created_at: Date;
	updated_at: Date;
}

export interface ExtraexpenseTable {
	id: number;
	budget_id: number;

	extraexpense_type: string;
	extraexpense_amount_monthly: number;
	extraexpense_date: Date;

	created_at: Date;
	updated_at: Date;
}

export const db: Dexie = new Dexie("Database") as Dexie & {
	budgets: EntityTable<BudgetTable, "id">;
	extraincomes: EntityTable<ExtraincomeTable, "id">;
	extraexpenses: EntityTable<ExtraexpenseTable, "id">;
};

db.version(1).stores({
	budgets: "++id, user_id, currency, created_at, updated_at",
	extraincomes:
		"++id, budget_id, extraincome_type, extraincome_amount_monthly, extraincome_includes_weekends, extraincome_date, created_at, updated_at",
	extraexpenses:
		"++id, budget_id, extraexpense_type, extraexpense_amount_monthly, extraexpense_date, created_at, updated_at",
});
