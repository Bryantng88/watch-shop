import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  variantId: z.string().optional().nullable(),
  name: z.string(),
  quantity: z.number().int().optional(),
  unitCost: z.number().optional().nullable(),
  notes: z.string().optional().nullable()
}).strict();
export const MaintenancePartCreateManyRecordInputObjectSchema: z.ZodType<Prisma.MaintenancePartCreateManyRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartCreateManyRecordInput>;
export const MaintenancePartCreateManyRecordInputObjectZodSchema = makeSchema();
