import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutAssignedWorkCasesInputObjectSchema as UserCreateWithoutAssignedWorkCasesInputObjectSchema } from './UserCreateWithoutAssignedWorkCasesInput.schema';
import { UserUncheckedCreateWithoutAssignedWorkCasesInputObjectSchema as UserUncheckedCreateWithoutAssignedWorkCasesInputObjectSchema } from './UserUncheckedCreateWithoutAssignedWorkCasesInput.schema';
import { UserCreateOrConnectWithoutAssignedWorkCasesInputObjectSchema as UserCreateOrConnectWithoutAssignedWorkCasesInputObjectSchema } from './UserCreateOrConnectWithoutAssignedWorkCasesInput.schema';
import { UserUpsertWithoutAssignedWorkCasesInputObjectSchema as UserUpsertWithoutAssignedWorkCasesInputObjectSchema } from './UserUpsertWithoutAssignedWorkCasesInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutAssignedWorkCasesInputObjectSchema as UserUpdateToOneWithWhereWithoutAssignedWorkCasesInputObjectSchema } from './UserUpdateToOneWithWhereWithoutAssignedWorkCasesInput.schema';
import { UserUpdateWithoutAssignedWorkCasesInputObjectSchema as UserUpdateWithoutAssignedWorkCasesInputObjectSchema } from './UserUpdateWithoutAssignedWorkCasesInput.schema';
import { UserUncheckedUpdateWithoutAssignedWorkCasesInputObjectSchema as UserUncheckedUpdateWithoutAssignedWorkCasesInputObjectSchema } from './UserUncheckedUpdateWithoutAssignedWorkCasesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutAssignedWorkCasesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutAssignedWorkCasesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAssignedWorkCasesInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAssignedWorkCasesInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutAssignedWorkCasesInputObjectSchema), z.lazy(() => UserUpdateWithoutAssignedWorkCasesInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutAssignedWorkCasesInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneWithoutAssignedWorkCasesNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneWithoutAssignedWorkCasesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneWithoutAssignedWorkCasesNestedInput>;
export const UserUpdateOneWithoutAssignedWorkCasesNestedInputObjectZodSchema = makeSchema();
