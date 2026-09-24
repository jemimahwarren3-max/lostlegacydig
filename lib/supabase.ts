// Supabase has been removed from this project. This stub keeps the existing
// `supabase.from(...).select()...` call sites working without a real backend,
// always resolving to empty results.
interface QueryBuilder {
  select: (...args: any[]) => QueryBuilder;
  eq: (...args: any[]) => QueryBuilder;
  neq: (...args: any[]) => QueryBuilder;
  order: (...args: any[]) => QueryBuilder;
  limit: (...args: any[]) => QueryBuilder;
  in: (...args: any[]) => QueryBuilder;
  gte: (...args: any[]) => QueryBuilder;
  lte: (...args: any[]) => QueryBuilder;
  or: (...args: any[]) => QueryBuilder;
  filter: (...args: any[]) => QueryBuilder;
  insert: (...args: any[]) => Promise<{ data: null; error: null }>;
  maybeSingle: () => Promise<{ data: any; error: null }>;
  single: () => Promise<{ data: any; error: null }>;
  then: <TResult>(
    resolve: (value: { data: any[]; error: null }) => TResult
  ) => TResult;
}

function createQueryBuilder(): QueryBuilder {
  const builder: QueryBuilder = {
    select: () => builder,
    eq: () => builder,
    neq: () => builder,
    order: () => builder,
    limit: () => builder,
    in: () => builder,
    gte: () => builder,
    lte: () => builder,
    or: () => builder,
    filter: () => builder,
    insert: async () => ({ data: null, error: null }),
    maybeSingle: async () => ({ data: null, error: null }),
    single: async () => ({ data: null, error: null }),
    then: (resolve) => resolve({ data: [], error: null }),
  };
  return builder;
}

export const supabase = {
  from: (_table: string) => createQueryBuilder(),
};
