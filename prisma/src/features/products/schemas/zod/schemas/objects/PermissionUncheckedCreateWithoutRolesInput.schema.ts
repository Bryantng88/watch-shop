import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string(),
  description: z.string().optional().nullable()
}).strict();
export const PermissionUncheckedCreateWithoutRolesInputObjectSchema: z.ZodType<Prisma.PermissionUncheckedCreateWithoutRolesInput> = makeSchema() as unknown as z.ZodType<Prisma.PermissionUncheckedCreateWithoutRolesInput>;
export const PermissionUncheckedCreateWithoutRolesInputObjectZodSchema = makeSchema();
