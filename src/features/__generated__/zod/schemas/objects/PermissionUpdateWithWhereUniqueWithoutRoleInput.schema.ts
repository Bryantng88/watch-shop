import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PermissionWhereUniqueInputObjectSchema as PermissionWhereUniqueInputObjectSchema } from './PermissionWhereUniqueInput.schema';
import { PermissionUpdateWithoutRoleInputObjectSchema as PermissionUpdateWithoutRoleInputObjectSchema } from './PermissionUpdateWithoutRoleInput.schema';
import { PermissionUncheckedUpdateWithoutRoleInputObjectSchema as PermissionUncheckedUpdateWithoutRoleInputObjectSchema } from './PermissionUncheckedUpdateWithoutRoleInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PermissionWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => PermissionUpdateWithoutRoleInputObjectSchema), z.lazy(() => PermissionUncheckedUpdateWithoutRoleInputObjectSchema)])
}).strict();
export const PermissionUpdateWithWhereUniqueWithoutRoleInputObjectSchema: z.ZodType<Prisma.PermissionUpdateWithWhereUniqueWithoutRoleInput> = makeSchema() as unknown as z.ZodType<Prisma.PermissionUpdateWithWhereUniqueWithoutRoleInput>;
export const PermissionUpdateWithWhereUniqueWithoutRoleInputObjectZodSchema = makeSchema();
