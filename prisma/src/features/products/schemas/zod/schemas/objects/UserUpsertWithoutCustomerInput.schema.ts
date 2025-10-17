import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutCustomerInputObjectSchema as UserUpdateWithoutCustomerInputObjectSchema } from './UserUpdateWithoutCustomerInput.schema';
import { UserUncheckedUpdateWithoutCustomerInputObjectSchema as UserUncheckedUpdateWithoutCustomerInputObjectSchema } from './UserUncheckedUpdateWithoutCustomerInput.schema';
import { UserCreateWithoutCustomerInputObjectSchema as UserCreateWithoutCustomerInputObjectSchema } from './UserCreateWithoutCustomerInput.schema';
import { UserUncheckedCreateWithoutCustomerInputObjectSchema as UserUncheckedCreateWithoutCustomerInputObjectSchema } from './UserUncheckedCreateWithoutCustomerInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutCustomerInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutCustomerInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutCustomerInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCustomerInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutCustomerInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutCustomerInput>;
export const UserUpsertWithoutCustomerInputObjectZodSchema = makeSchema();
