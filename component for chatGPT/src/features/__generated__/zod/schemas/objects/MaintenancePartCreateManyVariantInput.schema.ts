import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  recordId: z.string(),
  name: z.string(),
  quantity: z.number().int().optional(),
  unitCost: z.number().optional().nullable(),
  notes: z.string().optional().nullable()
}).strict();
export const MaintenancePartCreateManyVariantInputObjectSchema: z.ZodType<Prisma.MaintenancePartCreateManyVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartCreateManyVariantInput>;
export const MaintenancePartCreateManyVariantInputObjectZodSchema = makeSchema();
