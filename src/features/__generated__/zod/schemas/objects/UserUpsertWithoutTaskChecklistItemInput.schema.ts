import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutTaskChecklistItemInputObjectSchema as UserUpdateWithoutTaskChecklistItemInputObjectSchema } from './UserUpdateWithoutTaskChecklistItemInput.schema';
import { UserUncheckedUpdateWithoutTaskChecklistItemInputObjectSchema as UserUncheckedUpdateWithoutTaskChecklistItemInputObjectSchema } from './UserUncheckedUpdateWithoutTaskChecklistItemInput.schema';
import { UserCreateWithoutTaskChecklistItemInputObjectSchema as UserCreateWithoutTaskChecklistItemInputObjectSchema } from './UserCreateWithoutTaskChecklistItemInput.schema';
import { UserUncheckedCreateWithoutTaskChecklistItemInputObjectSchema as UserUncheckedCreateWithoutTaskChecklistItemInputObjectSchema } from './UserUncheckedCreateWithoutTaskChecklistItemInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutTaskChecklistItemInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutTaskChecklistItemInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutTaskChecklistItemInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutTaskChecklistItemInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutTaskChecklistItemInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutTaskChecklistItemInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutTaskChecklistItemInput>;
export const UserUpsertWithoutTaskChecklistItemInputObjectZodSchema = makeSchema();
