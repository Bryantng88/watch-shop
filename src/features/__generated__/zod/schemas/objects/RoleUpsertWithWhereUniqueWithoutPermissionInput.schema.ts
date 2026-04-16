import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleWhereUniqueInputObjectSchema as RoleWhereUniqueInputObjectSchema } from './RoleWhereUniqueInput.schema';
import { RoleUpdateWithoutPermissionInputObjectSchema as RoleUpdateWithoutPermissionInputObjectSchema } from './RoleUpdateWithoutPermissionInput.schema';
import { RoleUncheckedUpdateWithoutPermissionInputObjectSchema as RoleUncheckedUpdateWithoutPermissionInputObjectSchema } from './RoleUncheckedUpdateWithoutPermissionInput.schema';
import { RoleCreateWithoutPermissionInputObjectSchema as RoleCreateWithoutPermissionInputObjectSchema } from './RoleCreateWithoutPermissionInput.schema';
import { RoleUncheckedCreateWithoutPermissionInputObjectSchema as RoleUncheckedCreateWithoutPermissionInputObjectSchema } from './RoleUncheckedCreateWithoutPermissionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RoleWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => RoleUpdateWithoutPermissionInputObjectSchema), z.lazy(() => RoleUncheckedUpdateWithoutPermissionInputObjectSchema)]),
  create: z.union([z.lazy(() => RoleCreateWithoutPermissionInputObjectSchema), z.lazy(() => RoleUncheckedCreateWithoutPermissionInputObjectSchema)])
}).strict();
export const RoleUpsertWithWhereUniqueWithoutPermissionInputObjectSchema: z.ZodType<Prisma.RoleUpsertWithWhereUniqueWithoutPermissionInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUpsertWithWhereUniqueWithoutPermissionInput>;
export const RoleUpsertWithWhereUniqueWithoutPermissionInputObjectZodSchema = makeSchema();
