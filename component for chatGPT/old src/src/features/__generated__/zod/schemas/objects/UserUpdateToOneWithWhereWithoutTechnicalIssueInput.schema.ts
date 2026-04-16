import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutTechnicalIssueInputObjectSchema as UserUpdateWithoutTechnicalIssueInputObjectSchema } from './UserUpdateWithoutTechnicalIssueInput.schema';
import { UserUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as UserUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './UserUncheckedUpdateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutTechnicalIssueInput>;
export const UserUpdateToOneWithWhereWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
