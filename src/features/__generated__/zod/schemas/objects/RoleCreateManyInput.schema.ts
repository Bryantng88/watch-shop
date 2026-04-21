import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable()
}).strict();
export const RoleCreateManyInputObjectSchema: z.ZodType<Prisma.RoleCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleCreateManyInput>;
export const RoleCreateManyInputObjectZodSchema = makeSchema();
