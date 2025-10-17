import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutCustomerInputObjectSchema as UserCreateWithoutCustomerInputObjectSchema } from './UserCreateWithoutCustomerInput.schema';
import { UserUncheckedCreateWithoutCustomerInputObjectSchema as UserUncheckedCreateWithoutCustomerInputObjectSchema } from './UserUncheckedCreateWithoutCustomerInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutCustomerInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutCustomerInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutCustomerInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutCustomerInput>;
export const UserCreateOrConnectWithoutCustomerInputObjectZodSchema = makeSchema();
