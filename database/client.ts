import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export { sql, eq, and, or } from 'drizzle-orm';

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema });
}