import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutAssignedWorkCasesInputObjectSchema as UserCreateWithoutAssignedWorkCasesInputObjectSchema } from './UserCreateWithoutAssignedWorkCasesInput.schema';
import { UserUncheckedCreateWithoutAssignedWorkCasesInputObjectSchema as UserUncheckedCreateWithoutAssignedWorkCasesInputObjectSchema } from './UserUncheckedCreateWithoutAssignedWorkCasesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutAssignedWorkCasesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutAssignedWorkCasesInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutAssignedWorkCasesInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAssignedWorkCasesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutAssignedWorkCasesInput>;
export const UserCreateOrConnectWithoutAssignedWorkCasesInputObjectZodSchema = makeSchema();
