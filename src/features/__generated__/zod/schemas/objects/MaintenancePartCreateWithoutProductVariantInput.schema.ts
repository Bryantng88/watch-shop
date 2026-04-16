import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateNestedOneWithoutMaintenancePartInputObjectSchema as MaintenanceRecordCreateNestedOneWithoutMaintenancePartInputObjectSchema } from './MaintenanceRecordCreateNestedOneWithoutMaintenancePartInput.schema'

const makeSchema = () => z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number().int().optional(),
  unitCost: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
  MaintenanceRecord: z.lazy(() => MaintenanceRecordCreateNestedOneWithoutMaintenancePartInputObjectSchema)
}).strict();
export const MaintenancePartCreateWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.MaintenancePartCreateWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartCreateWithoutProductVariantInput>;
export const MaintenancePartCreateWithoutProductVariantInputObjectZodSchema = makeSchema();
