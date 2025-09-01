import { useDrizzle } from '~~/database/client';

export const useCustomDatabase = () => {
  return useDrizzle();
};