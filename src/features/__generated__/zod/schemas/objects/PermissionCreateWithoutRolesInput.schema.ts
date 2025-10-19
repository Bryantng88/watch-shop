import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string(),
  description: z.string().optional().nullable()
}).strict();
export const PermissionCreateWithoutRolesInputObjectSchema: z.ZodType<Prisma.PermissionCreateWithoutRolesInput> = makeSchema() as unknown as z.ZodType<Prisma.PermissionCreateWithoutRolesInput>;
export const PermissionCreateWithoutRolesInputObjectZodSchema = makeSchema();
