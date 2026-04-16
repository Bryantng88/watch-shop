import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PermissionWhereUniqueInputObjectSchema as PermissionWhereUniqueInputObjectSchema } from './PermissionWhereUniqueInput.schema';
import { PermissionCreateWithoutRolesInputObjectSchema as PermissionCreateWithoutRolesInputObjectSchema } from './PermissionCreateWithoutRolesInput.schema';
import { PermissionUncheckedCreateWithoutRolesInputObjectSchema as PermissionUncheckedCreateWithoutRolesInputObjectSchema } from './PermissionUncheckedCreateWithoutRolesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PermissionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PermissionCreateWithoutRolesInputObjectSchema), z.lazy(() => PermissionUncheckedCreateWithoutRolesInputObjectSchema)])
}).strict();
export const PermissionCreateOrConnectWithoutRolesInputObjectSchema: z.ZodType<Prisma.PermissionCreateOrConnectWithoutRolesInput> = makeSchema() as unknown as z.ZodType<Prisma.PermissionCreateOrConnectWithoutRolesInput>;
export const PermissionCreateOrConnectWithoutRolesInputObjectZodSchema = makeSchema();
