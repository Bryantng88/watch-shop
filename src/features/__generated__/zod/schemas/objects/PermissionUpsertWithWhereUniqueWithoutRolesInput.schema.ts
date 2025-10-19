import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PermissionWhereUniqueInputObjectSchema as PermissionWhereUniqueInputObjectSchema } from './PermissionWhereUniqueInput.schema';
import { PermissionUpdateWithoutRolesInputObjectSchema as PermissionUpdateWithoutRolesInputObjectSchema } from './PermissionUpdateWithoutRolesInput.schema';
import { PermissionUncheckedUpdateWithoutRolesInputObjectSchema as PermissionUncheckedUpdateWithoutRolesInputObjectSchema } from './PermissionUncheckedUpdateWithoutRolesInput.schema';
import { PermissionCreateWithoutRolesInputObjectSchema as PermissionCreateWithoutRolesInputObjectSchema } from './PermissionCreateWithoutRolesInput.schema';
import { PermissionUncheckedCreateWithoutRolesInputObjectSchema as PermissionUncheckedCreateWithoutRolesInputObjectSchema } from './PermissionUncheckedCreateWithoutRolesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PermissionWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => PermissionUpdateWithoutRolesInputObjectSchema), z.lazy(() => PermissionUncheckedUpdateWithoutRolesInputObjectSchema)]),
  create: z.union([z.lazy(() => PermissionCreateWithoutRolesInputObjectSchema), z.lazy(() => PermissionUncheckedCreateWithoutRolesInputObjectSchema)])
}).strict();
export const PermissionUpsertWithWhereUniqueWithoutRolesInputObjectSchema: z.ZodType<Prisma.PermissionUpsertWithWhereUniqueWithoutRolesInput> = makeSchema() as unknown as z.ZodType<Prisma.PermissionUpsertWithWhereUniqueWithoutRolesInput>;
export const PermissionUpsertWithWhereUniqueWithoutRolesInputObjectZodSchema = makeSchema();
