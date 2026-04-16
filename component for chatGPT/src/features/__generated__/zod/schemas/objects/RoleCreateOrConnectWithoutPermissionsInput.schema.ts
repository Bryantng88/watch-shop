import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleWhereUniqueInputObjectSchema as RoleWhereUniqueInputObjectSchema } from './RoleWhereUniqueInput.schema';
import { RoleCreateWithoutPermissionsInputObjectSchema as RoleCreateWithoutPermissionsInputObjectSchema } from './RoleCreateWithoutPermissionsInput.schema';
import { RoleUncheckedCreateWithoutPermissionsInputObjectSchema as RoleUncheckedCreateWithoutPermissionsInputObjectSchema } from './RoleUncheckedCreateWithoutPermissionsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RoleWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => RoleCreateWithoutPermissionsInputObjectSchema), z.lazy(() => RoleUncheckedCreateWithoutPermissionsInputObjectSchema)])
}).strict();
export const RoleCreateOrConnectWithoutPermissionsInputObjectSchema: z.ZodType<Prisma.RoleCreateOrConnectWithoutPermissionsInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleCreateOrConnectWithoutPermissionsInput>;
export const RoleCreateOrConnectWithoutPermissionsInputObjectZodSchema = makeSchema();
