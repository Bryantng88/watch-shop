import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleWhereUniqueInputObjectSchema as RoleWhereUniqueInputObjectSchema } from './RoleWhereUniqueInput.schema';
import { RoleUpdateWithoutPermissionInputObjectSchema as RoleUpdateWithoutPermissionInputObjectSchema } from './RoleUpdateWithoutPermissionInput.schema';
import { RoleUncheckedUpdateWithoutPermissionInputObjectSchema as RoleUncheckedUpdateWithoutPermissionInputObjectSchema } from './RoleUncheckedUpdateWithoutPermissionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RoleWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => RoleUpdateWithoutPermissionInputObjectSchema), z.lazy(() => RoleUncheckedUpdateWithoutPermissionInputObjectSchema)])
}).strict();
export const RoleUpdateWithWhereUniqueWithoutPermissionInputObjectSchema: z.ZodType<Prisma.RoleUpdateWithWhereUniqueWithoutPermissionInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUpdateWithWhereUniqueWithoutPermissionInput>;
export const RoleUpdateWithWhereUniqueWithoutPermissionInputObjectZodSchema = makeSchema();
