import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutTaskChecklistItemInputObjectSchema as UserCreateWithoutTaskChecklistItemInputObjectSchema } from './UserCreateWithoutTaskChecklistItemInput.schema';
import { UserUncheckedCreateWithoutTaskChecklistItemInputObjectSchema as UserUncheckedCreateWithoutTaskChecklistItemInputObjectSchema } from './UserUncheckedCreateWithoutTaskChecklistItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutTaskChecklistItemInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutTaskChecklistItemInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutTaskChecklistItemInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutTaskChecklistItemInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutTaskChecklistItemInput>;
export const UserCreateOrConnectWithoutTaskChecklistItemInputObjectZodSchema = makeSchema();
