import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutAssignedWorkCasesInputObjectSchema as UserCreateWithoutAssignedWorkCasesInputObjectSchema } from './UserCreateWithoutAssignedWorkCasesInput.schema';
import { UserUncheckedCreateWithoutAssignedWorkCasesInputObjectSchema as UserUncheckedCreateWithoutAssignedWorkCasesInputObjectSchema } from './UserUncheckedCreateWithoutAssignedWorkCasesInput.schema';
import { UserCreateOrConnectWithoutAssignedWorkCasesInputObjectSchema as UserCreateOrConnectWithoutAssignedWorkCasesInputObjectSchema } from './UserCreateOrConnectWithoutAssignedWorkCasesInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutAssignedWorkCasesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutAssignedWorkCasesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAssignedWorkCasesInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutAssignedWorkCasesInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAssignedWorkCasesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutAssignedWorkCasesInput>;
export const UserCreateNestedOneWithoutAssignedWorkCasesInputObjectZodSchema = makeSchema();
