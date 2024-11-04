import Dexie, { type EntityTable } from "dexie";
import type { IBudget, IExpense, IIncome } from "../types";

export const db: Dexie & {
	budgets: EntityTable<IBudget, "id">;
	incomes: EntityTable<IIncome, "id">;
	expenses: EntityTable<IExpense, "id">;
} = new Dexie("Database") as Dexie & {
	budgets: EntityTable<IBudget, "id">;
	incomes: EntityTable<IIncome, "id">;
	expenses: EntityTable<IExpense, "id">;
};

db.version(1).stores({
	budgets: "++id, user_id, currency, incomes, expenses, created_at, updated_at",
	incomes: "++id, user_id, type, amount_monthly, includes_weekends, date, created_at, updated_at",
	expenses: "++id, user_id, type, amount_monthly, date, created_at, updated_at",
});
