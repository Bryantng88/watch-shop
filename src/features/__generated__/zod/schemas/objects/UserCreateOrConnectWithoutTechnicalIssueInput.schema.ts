import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutTechnicalIssueInputObjectSchema as UserCreateWithoutTechnicalIssueInputObjectSchema } from './UserCreateWithoutTechnicalIssueInput.schema';
import { UserUncheckedCreateWithoutTechnicalIssueInputObjectSchema as UserUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './UserUncheckedCreateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutTechnicalIssueInput>;
export const UserCreateOrConnectWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
