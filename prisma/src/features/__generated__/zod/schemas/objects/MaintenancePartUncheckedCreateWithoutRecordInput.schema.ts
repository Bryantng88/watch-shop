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
export const MaintenancePartUncheckedCreateWithoutRecordInputObjectSchema: z.ZodType<Prisma.MaintenancePartUncheckedCreateWithoutRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartUncheckedCreateWithoutRecordInput>;
export const MaintenancePartUncheckedCreateWithoutRecordInputObjectZodSchema = makeSchema();
