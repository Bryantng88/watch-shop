import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { MaintenanceRecordOrderByWithRelationInputObjectSchema as MaintenanceRecordOrderByWithRelationInputObjectSchema } from './MaintenanceRecordOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  defaultPrice: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  durationMin: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isActive: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  maintenanceRecordId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  MaintenanceRecord: z.lazy(() => MaintenanceRecordOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const ServiceCatalogOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ServiceCatalogOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogOrderByWithRelationInput>;
export const ServiceCatalogOrderByWithRelationInputObjectZodSchema = makeSchema();
