import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateNestedOneWithoutMaintenancePartInputObjectSchema as ProductVariantCreateNestedOneWithoutMaintenancePartInputObjectSchema } from './ProductVariantCreateNestedOneWithoutMaintenancePartInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  quantity: z.number().int().optional(),
  unitCost: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
  ProductVariant: z.lazy(() => ProductVariantCreateNestedOneWithoutMaintenancePartInputObjectSchema).optional()
}).strict();
export const MaintenancePartCreateWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.MaintenancePartCreateWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartCreateWithoutMaintenanceRecordInput>;
export const MaintenancePartCreateWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
