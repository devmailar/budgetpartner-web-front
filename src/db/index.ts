import Dexie, { type EntityTable } from "dexie";

export interface BudgetTable {
	id: number;
	currency: string;

	created_at: Date;
	updated_at: Date;
}

export interface ExtraincomeTable {
	id: number;
	budget_id: number;

	type: string;
	amount_monthly: number;
	includes_weekends: boolean;
	date: Date;

	created_at: Date;
	updated_at: Date;
}

export interface ExtraexpenseTable {
	id: number;
	budget_id: number;

	type: string;
	amount_monthly: number;
	date: Date;

	created_at: Date;
	updated_at: Date;
}

export const db: Dexie = new Dexie("Database") as Dexie & {
	budgets: EntityTable<BudgetTable, "id">;
	extraincomes: EntityTable<ExtraincomeTable, "id">;
	extraexpenses: EntityTable<ExtraexpenseTable, "id">;
};

db.version(1).stores({
	budgets: "++id, currency, created_at, updated_at",
	extraincomes: "++id, budget_id, type, amount_monthly, includes_weekends, date, created_at, updated_at",
	extraexpenses: "++id, budget_id, type, amount_monthly, date, created_at, updated_at",
});
