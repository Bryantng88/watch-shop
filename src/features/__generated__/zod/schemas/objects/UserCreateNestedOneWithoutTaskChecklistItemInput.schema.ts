import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutTaskChecklistItemInputObjectSchema as UserCreateWithoutTaskChecklistItemInputObjectSchema } from './UserCreateWithoutTaskChecklistItemInput.schema';
import { UserUncheckedCreateWithoutTaskChecklistItemInputObjectSchema as UserUncheckedCreateWithoutTaskChecklistItemInputObjectSchema } from './UserUncheckedCreateWithoutTaskChecklistItemInput.schema';
import { UserCreateOrConnectWithoutTaskChecklistItemInputObjectSchema as UserCreateOrConnectWithoutTaskChecklistItemInputObjectSchema } from './UserCreateOrConnectWithoutTaskChecklistItemInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutTaskChecklistItemInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutTaskChecklistItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTaskChecklistItemInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutTaskChecklistItemInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutTaskChecklistItemInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutTaskChecklistItemInput>;
export const UserCreateNestedOneWithoutTaskChecklistItemInputObjectZodSchema = makeSchema();
