import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutRaisedWorkCasesInputObjectSchema as UserUpdateWithoutRaisedWorkCasesInputObjectSchema } from './UserUpdateWithoutRaisedWorkCasesInput.schema';
import { UserUncheckedUpdateWithoutRaisedWorkCasesInputObjectSchema as UserUncheckedUpdateWithoutRaisedWorkCasesInputObjectSchema } from './UserUncheckedUpdateWithoutRaisedWorkCasesInput.schema';
import { UserCreateWithoutRaisedWorkCasesInputObjectSchema as UserCreateWithoutRaisedWorkCasesInputObjectSchema } from './UserCreateWithoutRaisedWorkCasesInput.schema';
import { UserUncheckedCreateWithoutRaisedWorkCasesInputObjectSchema as UserUncheckedCreateWithoutRaisedWorkCasesInputObjectSchema } from './UserUncheckedCreateWithoutRaisedWorkCasesInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutRaisedWorkCasesInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutRaisedWorkCasesInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutRaisedWorkCasesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutRaisedWorkCasesInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutRaisedWorkCasesInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutRaisedWorkCasesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutRaisedWorkCasesInput>;
export const UserUpsertWithoutRaisedWorkCasesInputObjectZodSchema = makeSchema();
