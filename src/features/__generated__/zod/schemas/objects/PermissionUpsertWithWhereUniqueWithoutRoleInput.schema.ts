import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PermissionWhereUniqueInputObjectSchema as PermissionWhereUniqueInputObjectSchema } from './PermissionWhereUniqueInput.schema';
import { PermissionUpdateWithoutRoleInputObjectSchema as PermissionUpdateWithoutRoleInputObjectSchema } from './PermissionUpdateWithoutRoleInput.schema';
import { PermissionUncheckedUpdateWithoutRoleInputObjectSchema as PermissionUncheckedUpdateWithoutRoleInputObjectSchema } from './PermissionUncheckedUpdateWithoutRoleInput.schema';
import { PermissionCreateWithoutRoleInputObjectSchema as PermissionCreateWithoutRoleInputObjectSchema } from './PermissionCreateWithoutRoleInput.schema';
import { PermissionUncheckedCreateWithoutRoleInputObjectSchema as PermissionUncheckedCreateWithoutRoleInputObjectSchema } from './PermissionUncheckedCreateWithoutRoleInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PermissionWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => PermissionUpdateWithoutRoleInputObjectSchema), z.lazy(() => PermissionUncheckedUpdateWithoutRoleInputObjectSchema)]),
  create: z.union([z.lazy(() => PermissionCreateWithoutRoleInputObjectSchema), z.lazy(() => PermissionUncheckedCreateWithoutRoleInputObjectSchema)])
}).strict();
export const PermissionUpsertWithWhereUniqueWithoutRoleInputObjectSchema: z.ZodType<Prisma.PermissionUpsertWithWhereUniqueWithoutRoleInput> = makeSchema() as unknown as z.ZodType<Prisma.PermissionUpsertWithWhereUniqueWithoutRoleInput>;
export const PermissionUpsertWithWhereUniqueWithoutRoleInputObjectZodSchema = makeSchema();
