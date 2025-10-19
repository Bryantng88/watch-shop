import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutCustomerInputObjectSchema as UserUpdateWithoutCustomerInputObjectSchema } from './UserUpdateWithoutCustomerInput.schema';
import { UserUncheckedUpdateWithoutCustomerInputObjectSchema as UserUncheckedUpdateWithoutCustomerInputObjectSchema } from './UserUncheckedUpdateWithoutCustomerInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutCustomerInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutCustomerInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutCustomerInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutCustomerInput>;
export const UserUpdateToOneWithWhereWithoutCustomerInputObjectZodSchema = makeSchema();
