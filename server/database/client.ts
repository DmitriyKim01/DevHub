import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export { and, eq, or, sql } from 'drizzle-orm';

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema });
}
