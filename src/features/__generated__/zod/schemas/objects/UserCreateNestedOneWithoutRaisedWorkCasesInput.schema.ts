import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutRaisedWorkCasesInputObjectSchema as UserCreateWithoutRaisedWorkCasesInputObjectSchema } from './UserCreateWithoutRaisedWorkCasesInput.schema';
import { UserUncheckedCreateWithoutRaisedWorkCasesInputObjectSchema as UserUncheckedCreateWithoutRaisedWorkCasesInputObjectSchema } from './UserUncheckedCreateWithoutRaisedWorkCasesInput.schema';
import { UserCreateOrConnectWithoutRaisedWorkCasesInputObjectSchema as UserCreateOrConnectWithoutRaisedWorkCasesInputObjectSchema } from './UserCreateOrConnectWithoutRaisedWorkCasesInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutRaisedWorkCasesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutRaisedWorkCasesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutRaisedWorkCasesInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutRaisedWorkCasesInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutRaisedWorkCasesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutRaisedWorkCasesInput>;
export const UserCreateNestedOneWithoutRaisedWorkCasesInputObjectZodSchema = makeSchema();
