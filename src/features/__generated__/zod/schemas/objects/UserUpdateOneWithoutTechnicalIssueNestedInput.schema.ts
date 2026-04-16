import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutTechnicalIssueInputObjectSchema as UserCreateWithoutTechnicalIssueInputObjectSchema } from './UserCreateWithoutTechnicalIssueInput.schema';
import { UserUncheckedCreateWithoutTechnicalIssueInputObjectSchema as UserUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './UserUncheckedCreateWithoutTechnicalIssueInput.schema';
import { UserCreateOrConnectWithoutTechnicalIssueInputObjectSchema as UserCreateOrConnectWithoutTechnicalIssueInputObjectSchema } from './UserCreateOrConnectWithoutTechnicalIssueInput.schema';
import { UserUpsertWithoutTechnicalIssueInputObjectSchema as UserUpsertWithoutTechnicalIssueInputObjectSchema } from './UserUpsertWithoutTechnicalIssueInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema as UserUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema } from './UserUpdateToOneWithWhereWithoutTechnicalIssueInput.schema';
import { UserUpdateWithoutTechnicalIssueInputObjectSchema as UserUpdateWithoutTechnicalIssueInputObjectSchema } from './UserUpdateWithoutTechnicalIssueInput.schema';
import { UserUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as UserUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './UserUncheckedUpdateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutTechnicalIssueInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTechnicalIssueInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutTechnicalIssueInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema), z.lazy(() => UserUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneWithoutTechnicalIssueNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneWithoutTechnicalIssueNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneWithoutTechnicalIssueNestedInput>;
export const UserUpdateOneWithoutTechnicalIssueNestedInputObjectZodSchema = makeSchema();
