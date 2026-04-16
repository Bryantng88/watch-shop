import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string(),
  code: z.string(),
  description: z.string().optional().nullable()
}).strict();
export const PermissionCreateWithoutRoleInputObjectSchema: z.ZodType<Prisma.PermissionCreateWithoutRoleInput> = makeSchema() as unknown as z.ZodType<Prisma.PermissionCreateWithoutRoleInput>;
export const PermissionCreateWithoutRoleInputObjectZodSchema = makeSchema();
