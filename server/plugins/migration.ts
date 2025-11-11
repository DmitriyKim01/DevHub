import { consola } from 'consola';
import { migrate } from 'drizzle-orm/d1/migrator';
import { useDrizzle } from '~~/server/database/client';

export default defineNitroPlugin(async () => {
  if (!import.meta.dev) {
    return;
  }

  onHubReady(async () => {
    // Migrate the database
    await migrate(useDrizzle(), {
      migrationsFolder: 'database/migrations',
    })
      .then(() => {
        consola.success('Database migrated');
      })
      .catch(e => {
        consola.error('Error migrating database', e);
      });
  });
});
