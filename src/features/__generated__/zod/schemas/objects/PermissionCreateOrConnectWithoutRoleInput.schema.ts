import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PermissionWhereUniqueInputObjectSchema as PermissionWhereUniqueInputObjectSchema } from './PermissionWhereUniqueInput.schema';
import { PermissionCreateWithoutRoleInputObjectSchema as PermissionCreateWithoutRoleInputObjectSchema } from './PermissionCreateWithoutRoleInput.schema';
import { PermissionUncheckedCreateWithoutRoleInputObjectSchema as PermissionUncheckedCreateWithoutRoleInputObjectSchema } from './PermissionUncheckedCreateWithoutRoleInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PermissionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PermissionCreateWithoutRoleInputObjectSchema), z.lazy(() => PermissionUncheckedCreateWithoutRoleInputObjectSchema)])
}).strict();
export const PermissionCreateOrConnectWithoutRoleInputObjectSchema: z.ZodType<Prisma.PermissionCreateOrConnectWithoutRoleInput> = makeSchema() as unknown as z.ZodType<Prisma.PermissionCreateOrConnectWithoutRoleInput>;
export const PermissionCreateOrConnectWithoutRoleInputObjectZodSchema = makeSchema();
