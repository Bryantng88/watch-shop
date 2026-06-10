import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutAssignedWorkCasesInputObjectSchema as UserUpdateWithoutAssignedWorkCasesInputObjectSchema } from './UserUpdateWithoutAssignedWorkCasesInput.schema';
import { UserUncheckedUpdateWithoutAssignedWorkCasesInputObjectSchema as UserUncheckedUpdateWithoutAssignedWorkCasesInputObjectSchema } from './UserUncheckedUpdateWithoutAssignedWorkCasesInput.schema';
import { UserCreateWithoutAssignedWorkCasesInputObjectSchema as UserCreateWithoutAssignedWorkCasesInputObjectSchema } from './UserCreateWithoutAssignedWorkCasesInput.schema';
import { UserUncheckedCreateWithoutAssignedWorkCasesInputObjectSchema as UserUncheckedCreateWithoutAssignedWorkCasesInputObjectSchema } from './UserUncheckedCreateWithoutAssignedWorkCasesInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutAssignedWorkCasesInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutAssignedWorkCasesInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutAssignedWorkCasesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutAssignedWorkCasesInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutAssignedWorkCasesInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutAssignedWorkCasesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutAssignedWorkCasesInput>;
export const UserUpsertWithoutAssignedWorkCasesInputObjectZodSchema = makeSchema();
