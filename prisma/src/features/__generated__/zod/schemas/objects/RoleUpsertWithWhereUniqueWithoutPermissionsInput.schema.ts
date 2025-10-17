import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleWhereUniqueInputObjectSchema as RoleWhereUniqueInputObjectSchema } from './RoleWhereUniqueInput.schema';
import { RoleUpdateWithoutPermissionsInputObjectSchema as RoleUpdateWithoutPermissionsInputObjectSchema } from './RoleUpdateWithoutPermissionsInput.schema';
import { RoleUncheckedUpdateWithoutPermissionsInputObjectSchema as RoleUncheckedUpdateWithoutPermissionsInputObjectSchema } from './RoleUncheckedUpdateWithoutPermissionsInput.schema';
import { RoleCreateWithoutPermissionsInputObjectSchema as RoleCreateWithoutPermissionsInputObjectSchema } from './RoleCreateWithoutPermissionsInput.schema';
import { RoleUncheckedCreateWithoutPermissionsInputObjectSchema as RoleUncheckedCreateWithoutPermissionsInputObjectSchema } from './RoleUncheckedCreateWithoutPermissionsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RoleWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => RoleUpdateWithoutPermissionsInputObjectSchema), z.lazy(() => RoleUncheckedUpdateWithoutPermissionsInputObjectSchema)]),
  create: z.union([z.lazy(() => RoleCreateWithoutPermissionsInputObjectSchema), z.lazy(() => RoleUncheckedCreateWithoutPermissionsInputObjectSchema)])
}).strict();
export const RoleUpsertWithWhereUniqueWithoutPermissionsInputObjectSchema: z.ZodType<Prisma.RoleUpsertWithWhereUniqueWithoutPermissionsInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUpsertWithWhereUniqueWithoutPermissionsInput>;
export const RoleUpsertWithWhereUniqueWithoutPermissionsInputObjectZodSchema = makeSchema();
