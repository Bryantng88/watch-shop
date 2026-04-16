import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutTechnicalIssueInputObjectSchema as UserCreateWithoutTechnicalIssueInputObjectSchema } from './UserCreateWithoutTechnicalIssueInput.schema';
import { UserUncheckedCreateWithoutTechnicalIssueInputObjectSchema as UserUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './UserUncheckedCreateWithoutTechnicalIssueInput.schema';
import { UserCreateOrConnectWithoutTechnicalIssueInputObjectSchema as UserCreateOrConnectWithoutTechnicalIssueInputObjectSchema } from './UserCreateOrConnectWithoutTechnicalIssueInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutTechnicalIssueInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTechnicalIssueInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional()
}).strict();
export const UserCreateNestedOneWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutTechnicalIssueInput>;
export const UserCreateNestedOneWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
