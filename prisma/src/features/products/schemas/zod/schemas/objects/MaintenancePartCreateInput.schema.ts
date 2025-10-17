import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateNestedOneWithoutPartsInputObjectSchema as MaintenanceRecordCreateNestedOneWithoutPartsInputObjectSchema } from './MaintenanceRecordCreateNestedOneWithoutPartsInput.schema';
import { ProductVariantCreateNestedOneWithoutMaintenancePartInputObjectSchema as ProductVariantCreateNestedOneWithoutMaintenancePartInputObjectSchema } from './ProductVariantCreateNestedOneWithoutMaintenancePartInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  quantity: z.number().int().optional(),
  unitCost: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
  record: z.lazy(() => MaintenanceRecordCreateNestedOneWithoutPartsInputObjectSchema),
  variant: z.lazy(() => ProductVariantCreateNestedOneWithoutMaintenancePartInputObjectSchema).optional()
}).strict();
export const MaintenancePartCreateInputObjectSchema: z.ZodType<Prisma.MaintenancePartCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartCreateInput>;
export const MaintenancePartCreateInputObjectZodSchema = makeSchema();
