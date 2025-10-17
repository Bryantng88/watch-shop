import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutCustomerInputObjectSchema as UserCreateWithoutCustomerInputObjectSchema } from './UserCreateWithoutCustomerInput.schema';
import { UserUncheckedCreateWithoutCustomerInputObjectSchema as UserUncheckedCreateWithoutCustomerInputObjectSchema } from './UserUncheckedCreateWithoutCustomerInput.schema';
import { UserCreateOrConnectWithoutCustomerInputObjectSchema as UserCreateOrConnectWithoutCustomerInputObjectSchema } from './UserCreateOrConnectWithoutCustomerInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutCustomerInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCustomerInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCustomerInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutCustomerInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutCustomerInput>;
export const UserCreateNestedOneWithoutCustomerInputObjectZodSchema = makeSchema();
