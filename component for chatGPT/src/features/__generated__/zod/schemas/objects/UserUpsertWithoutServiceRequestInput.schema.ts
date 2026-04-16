import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutServiceRequestInputObjectSchema as UserUpdateWithoutServiceRequestInputObjectSchema } from './UserUpdateWithoutServiceRequestInput.schema';
import { UserUncheckedUpdateWithoutServiceRequestInputObjectSchema as UserUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './UserUncheckedUpdateWithoutServiceRequestInput.schema';
import { UserCreateWithoutServiceRequestInputObjectSchema as UserCreateWithoutServiceRequestInputObjectSchema } from './UserCreateWithoutServiceRequestInput.schema';
import { UserUncheckedCreateWithoutServiceRequestInputObjectSchema as UserUncheckedCreateWithoutServiceRequestInputObjectSchema } from './UserUncheckedCreateWithoutServiceRequestInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutServiceRequestInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutServiceRequestInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutServiceRequestInput>;
export const UserUpsertWithoutServiceRequestInputObjectZodSchema = makeSchema();
