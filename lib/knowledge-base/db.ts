import { neon } from "@neondatabase/serverless";

type SqlFn = ReturnType<typeof neon>;

let _instance: SqlFn | undefined;
const getInstance = (): SqlFn => {
  if (!_instance) _instance = neon((process.env.POSTGRES_URL ?? process.env.DATABASE_URL)!);
  return _instance;
};

export const sql: SqlFn = new Proxy(function () {} as unknown as SqlFn, {
  apply(_t, thisArg, args) {
    return getInstance().apply(thisArg, args as Parameters<SqlFn>);
  },
  get(_t, prop: string | symbol) {
    return Reflect.get(getInstance(), prop);
  },
});
