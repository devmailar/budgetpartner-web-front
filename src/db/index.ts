import Dexie, { type EntityTable } from "dexie";
import type { IBudget, IExtraexpense, IExtraincome } from "../types";

export const db: Dexie & {
	budgets: EntityTable<IBudget, "id">;
	extraincomes: EntityTable<IExtraincome, "id">;
	extraexpenses: EntityTable<IExtraexpense, "id">;
} = new Dexie("Database") as Dexie & {
	budgets: EntityTable<IBudget, "id">;
	extraincomes: EntityTable<IExtraincome, "id">;
	extraexpenses: EntityTable<IExtraexpense, "id">;
};

db.version(1).stores({
	budgets: "++id, user_id, currency, extraincomes, extraexpenses, created_at, updated_at",
	extraincomes: "++id, user_id, type, amount_monthly, includes_weekends, date, created_at, updated_at",
	extraexpenses: "++id, user_id, type, amount_monthly, date, created_at, updated_at",
});
