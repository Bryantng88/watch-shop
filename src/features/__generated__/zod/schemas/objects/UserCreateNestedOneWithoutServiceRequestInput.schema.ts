import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutServiceRequestInputObjectSchema as UserCreateWithoutServiceRequestInputObjectSchema } from './UserCreateWithoutServiceRequestInput.schema';
import { UserUncheckedCreateWithoutServiceRequestInputObjectSchema as UserUncheckedCreateWithoutServiceRequestInputObjectSchema } from './UserUncheckedCreateWithoutServiceRequestInput.schema';
import { UserCreateOrConnectWithoutServiceRequestInputObjectSchema as UserCreateOrConnectWithoutServiceRequestInputObjectSchema } from './UserCreateOrConnectWithoutServiceRequestInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutServiceRequestInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutServiceRequestInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutServiceRequestInput>;
export const UserCreateNestedOneWithoutServiceRequestInputObjectZodSchema = makeSchema();
