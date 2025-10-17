import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordArgsObjectSchema as MaintenanceRecordArgsObjectSchema } from './MaintenanceRecordArgs.schema';
import { ProductVariantArgsObjectSchema as ProductVariantArgsObjectSchema } from './ProductVariantArgs.schema'

const makeSchema = () => z.object({
  record: z.union([z.boolean(), z.lazy(() => MaintenanceRecordArgsObjectSchema)]).optional(),
  variant: z.union([z.boolean(), z.lazy(() => ProductVariantArgsObjectSchema)]).optional()
}).strict();
export const MaintenancePartIncludeObjectSchema: z.ZodType<Prisma.MaintenancePartInclude> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartInclude>;
export const MaintenancePartIncludeObjectZodSchema = makeSchema();
