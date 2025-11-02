import type { UserModel } from '../../server/schemas/user.schema';

export type PublicUser = Omit<UserModel, 'passwordHash'>;
