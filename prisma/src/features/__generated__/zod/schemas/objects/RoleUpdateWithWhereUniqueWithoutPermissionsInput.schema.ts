import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleWhereUniqueInputObjectSchema as RoleWhereUniqueInputObjectSchema } from './RoleWhereUniqueInput.schema';
import { RoleUpdateWithoutPermissionsInputObjectSchema as RoleUpdateWithoutPermissionsInputObjectSchema } from './RoleUpdateWithoutPermissionsInput.schema';
import { RoleUncheckedUpdateWithoutPermissionsInputObjectSchema as RoleUncheckedUpdateWithoutPermissionsInputObjectSchema } from './RoleUncheckedUpdateWithoutPermissionsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RoleWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => RoleUpdateWithoutPermissionsInputObjectSchema), z.lazy(() => RoleUncheckedUpdateWithoutPermissionsInputObjectSchema)])
}).strict();
export const RoleUpdateWithWhereUniqueWithoutPermissionsInputObjectSchema: z.ZodType<Prisma.RoleUpdateWithWhereUniqueWithoutPermissionsInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUpdateWithWhereUniqueWithoutPermissionsInput>;
export const RoleUpdateWithWhereUniqueWithoutPermissionsInputObjectZodSchema = makeSchema();
