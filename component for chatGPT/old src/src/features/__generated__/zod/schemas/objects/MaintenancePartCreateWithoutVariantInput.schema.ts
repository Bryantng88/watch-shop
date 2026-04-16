import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateNestedOneWithoutPartsInputObjectSchema as MaintenanceRecordCreateNestedOneWithoutPartsInputObjectSchema } from './MaintenanceRecordCreateNestedOneWithoutPartsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  quantity: z.number().int().optional(),
  unitCost: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
  record: z.lazy(() => MaintenanceRecordCreateNestedOneWithoutPartsInputObjectSchema)
}).strict();
export const MaintenancePartCreateWithoutVariantInputObjectSchema: z.ZodType<Prisma.MaintenancePartCreateWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartCreateWithoutVariantInput>;
export const MaintenancePartCreateWithoutVariantInputObjectZodSchema = makeSchema();
