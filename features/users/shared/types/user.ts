import type { UserModel } from '../../server/models/user.schema';

export type PublicUser = Omit<UserModel, 'passwordHash'>;