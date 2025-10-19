import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordArgsObjectSchema as MaintenanceRecordArgsObjectSchema } from './MaintenanceRecordArgs.schema';
import { ProductVariantArgsObjectSchema as ProductVariantArgsObjectSchema } from './ProductVariantArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  recordId: z.boolean().optional(),
  variantId: z.boolean().optional(),
  name: z.boolean().optional(),
  quantity: z.boolean().optional(),
  unitCost: z.boolean().optional(),
  notes: z.boolean().optional(),
  record: z.union([z.boolean(), z.lazy(() => MaintenanceRecordArgsObjectSchema)]).optional(),
  variant: z.union([z.boolean(), z.lazy(() => ProductVariantArgsObjectSchema)]).optional()
}).strict();
export const MaintenancePartSelectObjectSchema: z.ZodType<Prisma.MaintenancePartSelect> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartSelect>;
export const MaintenancePartSelectObjectZodSchema = makeSchema();
