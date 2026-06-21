import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutTaskChecklistItemInputObjectSchema as UserCreateWithoutTaskChecklistItemInputObjectSchema } from './UserCreateWithoutTaskChecklistItemInput.schema';
import { UserUncheckedCreateWithoutTaskChecklistItemInputObjectSchema as UserUncheckedCreateWithoutTaskChecklistItemInputObjectSchema } from './UserUncheckedCreateWithoutTaskChecklistItemInput.schema';
import { UserCreateOrConnectWithoutTaskChecklistItemInputObjectSchema as UserCreateOrConnectWithoutTaskChecklistItemInputObjectSchema } from './UserCreateOrConnectWithoutTaskChecklistItemInput.schema';
import { UserUpsertWithoutTaskChecklistItemInputObjectSchema as UserUpsertWithoutTaskChecklistItemInputObjectSchema } from './UserUpsertWithoutTaskChecklistItemInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutTaskChecklistItemInputObjectSchema as UserUpdateToOneWithWhereWithoutTaskChecklistItemInputObjectSchema } from './UserUpdateToOneWithWhereWithoutTaskChecklistItemInput.schema';
import { UserUpdateWithoutTaskChecklistItemInputObjectSchema as UserUpdateWithoutTaskChecklistItemInputObjectSchema } from './UserUpdateWithoutTaskChecklistItemInput.schema';
import { UserUncheckedUpdateWithoutTaskChecklistItemInputObjectSchema as UserUncheckedUpdateWithoutTaskChecklistItemInputObjectSchema } from './UserUncheckedUpdateWithoutTaskChecklistItemInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutTaskChecklistItemInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutTaskChecklistItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTaskChecklistItemInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutTaskChecklistItemInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutTaskChecklistItemInputObjectSchema), z.lazy(() => UserUpdateWithoutTaskChecklistItemInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutTaskChecklistItemInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneWithoutTaskChecklistItemNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneWithoutTaskChecklistItemNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneWithoutTaskChecklistItemNestedInput>;
export const UserUpdateOneWithoutTaskChecklistItemNestedInputObjectZodSchema = makeSchema();
