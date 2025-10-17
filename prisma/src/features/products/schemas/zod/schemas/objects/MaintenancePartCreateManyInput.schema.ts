import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  recordId: z.string(),
  variantId: z.string().optional().nullable(),
  name: z.string(),
  quantity: z.number().int().optional(),
  unitCost: z.number().optional().nullable(),
  notes: z.string().optional().nullable()
}).strict();
export const MaintenancePartCreateManyInputObjectSchema: z.ZodType<Prisma.MaintenancePartCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartCreateManyInput>;
export const MaintenancePartCreateManyInputObjectZodSchema = makeSchema();
