import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserUpdateWithoutTechnicalIssueInputObjectSchema as UserUpdateWithoutTechnicalIssueInputObjectSchema } from './UserUpdateWithoutTechnicalIssueInput.schema';
import { UserUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as UserUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './UserUncheckedUpdateWithoutTechnicalIssueInput.schema';
import { UserCreateWithoutTechnicalIssueInputObjectSchema as UserCreateWithoutTechnicalIssueInputObjectSchema } from './UserCreateWithoutTechnicalIssueInput.schema';
import { UserUncheckedCreateWithoutTechnicalIssueInputObjectSchema as UserUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './UserUncheckedCreateWithoutTechnicalIssueInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutTechnicalIssueInputObjectSchema)]),
  where: z.lazy(() => UserWhereInputObjectSchema).optional()
}).strict();
export const UserUpsertWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutTechnicalIssueInput>;
export const UserUpsertWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
