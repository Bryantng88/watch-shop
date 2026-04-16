import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PermissionWhereUniqueInputObjectSchema as PermissionWhereUniqueInputObjectSchema } from './PermissionWhereUniqueInput.schema';
import { PermissionUpdateWithoutRolesInputObjectSchema as PermissionUpdateWithoutRolesInputObjectSchema } from './PermissionUpdateWithoutRolesInput.schema';
import { PermissionUncheckedUpdateWithoutRolesInputObjectSchema as PermissionUncheckedUpdateWithoutRolesInputObjectSchema } from './PermissionUncheckedUpdateWithoutRolesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PermissionWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => PermissionUpdateWithoutRolesInputObjectSchema), z.lazy(() => PermissionUncheckedUpdateWithoutRolesInputObjectSchema)])
}).strict();
export const PermissionUpdateWithWhereUniqueWithoutRolesInputObjectSchema: z.ZodType<Prisma.PermissionUpdateWithWhereUniqueWithoutRolesInput> = makeSchema() as unknown as z.ZodType<Prisma.PermissionUpdateWithWhereUniqueWithoutRolesInput>;
export const PermissionUpdateWithWhereUniqueWithoutRolesInputObjectZodSchema = makeSchema();
