import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutAssignedWorkCasesInputObjectSchema as UserUpdateWithoutAssignedWorkCasesInputObjectSchema } from './UserUpdateWithoutAssignedWorkCasesInput.schema';
import { UserUncheckedUpdateWithoutAssignedWorkCasesInputObjectSchema as UserUncheckedUpdateWithoutAssignedWorkCasesInputObjectSchema } from './UserUncheckedUpdateWithoutAssignedWorkCasesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutAssignedWorkCasesInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutAssignedWorkCasesInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutAssignedWorkCasesInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAssignedWorkCasesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAssignedWorkCasesInput>;
export const UserUpdateToOneWithWhereWithoutAssignedWorkCasesInputObjectZodSchema = makeSchema();
