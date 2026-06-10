import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutRaisedWorkCasesInputObjectSchema as UserUpdateWithoutRaisedWorkCasesInputObjectSchema } from './UserUpdateWithoutRaisedWorkCasesInput.schema';
import { UserUncheckedUpdateWithoutRaisedWorkCasesInputObjectSchema as UserUncheckedUpdateWithoutRaisedWorkCasesInputObjectSchema } from './UserUncheckedUpdateWithoutRaisedWorkCasesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutRaisedWorkCasesInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutRaisedWorkCasesInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutRaisedWorkCasesInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutRaisedWorkCasesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutRaisedWorkCasesInput>;
export const UserUpdateToOneWithWhereWithoutRaisedWorkCasesInputObjectZodSchema = makeSchema();
