import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutRaisedWorkCasesInputObjectSchema as UserCreateWithoutRaisedWorkCasesInputObjectSchema } from './UserCreateWithoutRaisedWorkCasesInput.schema';
import { UserUncheckedCreateWithoutRaisedWorkCasesInputObjectSchema as UserUncheckedCreateWithoutRaisedWorkCasesInputObjectSchema } from './UserUncheckedCreateWithoutRaisedWorkCasesInput.schema';
import { UserCreateOrConnectWithoutRaisedWorkCasesInputObjectSchema as UserCreateOrConnectWithoutRaisedWorkCasesInputObjectSchema } from './UserCreateOrConnectWithoutRaisedWorkCasesInput.schema';
import { UserUpsertWithoutRaisedWorkCasesInputObjectSchema as UserUpsertWithoutRaisedWorkCasesInputObjectSchema } from './UserUpsertWithoutRaisedWorkCasesInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutRaisedWorkCasesInputObjectSchema as UserUpdateToOneWithWhereWithoutRaisedWorkCasesInputObjectSchema } from './UserUpdateToOneWithWhereWithoutRaisedWorkCasesInput.schema';
import { UserUpdateWithoutRaisedWorkCasesInputObjectSchema as UserUpdateWithoutRaisedWorkCasesInputObjectSchema } from './UserUpdateWithoutRaisedWorkCasesInput.schema';
import { UserUncheckedUpdateWithoutRaisedWorkCasesInputObjectSchema as UserUncheckedUpdateWithoutRaisedWorkCasesInputObjectSchema } from './UserUncheckedUpdateWithoutRaisedWorkCasesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutRaisedWorkCasesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutRaisedWorkCasesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutRaisedWorkCasesInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutRaisedWorkCasesInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutRaisedWorkCasesInputObjectSchema), z.lazy(() => UserUpdateWithoutRaisedWorkCasesInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutRaisedWorkCasesInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneWithoutRaisedWorkCasesNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneWithoutRaisedWorkCasesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneWithoutRaisedWorkCasesNestedInput>;
export const UserUpdateOneWithoutRaisedWorkCasesNestedInputObjectZodSchema = makeSchema();
