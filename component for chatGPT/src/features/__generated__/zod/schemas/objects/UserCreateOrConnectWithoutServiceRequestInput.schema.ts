import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutServiceRequestInputObjectSchema as UserCreateWithoutServiceRequestInputObjectSchema } from './UserCreateWithoutServiceRequestInput.schema';
import { UserUncheckedCreateWithoutServiceRequestInputObjectSchema as UserUncheckedCreateWithoutServiceRequestInputObjectSchema } from './UserUncheckedCreateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutServiceRequestInput>;
export const UserCreateOrConnectWithoutServiceRequestInputObjectZodSchema = makeSchema();
