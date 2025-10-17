import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string().optional()
}).strict();
export const PermissionWhereUniqueInputObjectSchema: z.ZodType<Prisma.PermissionWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.PermissionWhereUniqueInput>;
export const PermissionWhereUniqueInputObjectZodSchema = makeSchema();
