import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutCustomerInputObjectSchema as UserCreateWithoutCustomerInputObjectSchema } from './UserCreateWithoutCustomerInput.schema';
import { UserUncheckedCreateWithoutCustomerInputObjectSchema as UserUncheckedCreateWithoutCustomerInputObjectSchema } from './UserUncheckedCreateWithoutCustomerInput.schema';
import { UserCreateOrConnectWithoutCustomerInputObjectSchema as UserCreateOrConnectWithoutCustomerInputObjectSchema } from './UserCreateOrConnectWithoutCustomerInput.schema';
import { UserUpsertWithoutCustomerInputObjectSchema as UserUpsertWithoutCustomerInputObjectSchema } from './UserUpsertWithoutCustomerInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutCustomerInputObjectSchema as UserUpdateToOneWithWhereWithoutCustomerInputObjectSchema } from './UserUpdateToOneWithWhereWithoutCustomerInput.schema';
import { UserUpdateWithoutCustomerInputObjectSchema as UserUpdateWithoutCustomerInputObjectSchema } from './UserUpdateWithoutCustomerInput.schema';
import { UserUncheckedUpdateWithoutCustomerInputObjectSchema as UserUncheckedUpdateWithoutCustomerInputObjectSchema } from './UserUncheckedUpdateWithoutCustomerInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutCustomerInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCustomerInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCustomerInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutCustomerInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutCustomerInputObjectSchema), z.lazy(() => UserUpdateWithoutCustomerInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutCustomerInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneWithoutCustomerNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneWithoutCustomerNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneWithoutCustomerNestedInput>;
export const UserUpdateOneWithoutCustomerNestedInputObjectZodSchema = makeSchema();
