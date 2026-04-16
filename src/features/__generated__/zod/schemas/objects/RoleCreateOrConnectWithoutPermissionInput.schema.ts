import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleWhereUniqueInputObjectSchema as RoleWhereUniqueInputObjectSchema } from './RoleWhereUniqueInput.schema';
import { RoleCreateWithoutPermissionInputObjectSchema as RoleCreateWithoutPermissionInputObjectSchema } from './RoleCreateWithoutPermissionInput.schema';
import { RoleUncheckedCreateWithoutPermissionInputObjectSchema as RoleUncheckedCreateWithoutPermissionInputObjectSchema } from './RoleUncheckedCreateWithoutPermissionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RoleWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => RoleCreateWithoutPermissionInputObjectSchema), z.lazy(() => RoleUncheckedCreateWithoutPermissionInputObjectSchema)])
}).strict();
export const RoleCreateOrConnectWithoutPermissionInputObjectSchema: z.ZodType<Prisma.RoleCreateOrConnectWithoutPermissionInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleCreateOrConnectWithoutPermissionInput>;
export const RoleCreateOrConnectWithoutPermissionInputObjectZodSchema = makeSchema();
