import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutRaisedWorkCasesInputObjectSchema as UserCreateWithoutRaisedWorkCasesInputObjectSchema } from './UserCreateWithoutRaisedWorkCasesInput.schema';
import { UserUncheckedCreateWithoutRaisedWorkCasesInputObjectSchema as UserUncheckedCreateWithoutRaisedWorkCasesInputObjectSchema } from './UserUncheckedCreateWithoutRaisedWorkCasesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutRaisedWorkCasesInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutRaisedWorkCasesInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutRaisedWorkCasesInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutRaisedWorkCasesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutRaisedWorkCasesInput>;
export const UserCreateOrConnectWithoutRaisedWorkCasesInputObjectZodSchema = makeSchema();
