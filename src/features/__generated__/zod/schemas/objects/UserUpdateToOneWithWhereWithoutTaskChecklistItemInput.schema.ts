import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutTaskChecklistItemInputObjectSchema as UserUpdateWithoutTaskChecklistItemInputObjectSchema } from './UserUpdateWithoutTaskChecklistItemInput.schema';
import { UserUncheckedUpdateWithoutTaskChecklistItemInputObjectSchema as UserUncheckedUpdateWithoutTaskChecklistItemInputObjectSchema } from './UserUncheckedUpdateWithoutTaskChecklistItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutTaskChecklistItemInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutTaskChecklistItemInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutTaskChecklistItemInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutTaskChecklistItemInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutTaskChecklistItemInput>;
export const UserUpdateToOneWithWhereWithoutTaskChecklistItemInputObjectZodSchema = makeSchema();
