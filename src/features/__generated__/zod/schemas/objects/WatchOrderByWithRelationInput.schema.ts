import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ProductOrderByWithRelationInputObjectSchema as ProductOrderByWithRelationInputObjectSchema } from './ProductOrderByWithRelationInput.schema';
import { WatchContentOrderByWithRelationInputObjectSchema as WatchContentOrderByWithRelationInputObjectSchema } from './WatchContentOrderByWithRelationInput.schema';
import { WatchPriceOrderByWithRelationInputObjectSchema as WatchPriceOrderByWithRelationInputObjectSchema } from './WatchPriceOrderByWithRelationInput.schema';
import { WatchSpecV2OrderByWithRelationInputObjectSchema as WatchSpecV2OrderByWithRelationInputObjectSchema } from './WatchSpecV2OrderByWithRelationInput.schema';
import { WatchReviewStateOrderByRelationAggregateInputObjectSchema as WatchReviewStateOrderByRelationAggregateInputObjectSchema } from './WatchReviewStateOrderByRelationAggregateInput.schema';
import { TaskOrderByRelationAggregateInputObjectSchema as TaskOrderByRelationAggregateInputObjectSchema } from './TaskOrderByRelationAggregateInput.schema';
import { WorkCaseOrderByRelationAggregateInputObjectSchema as WorkCaseOrderByRelationAggregateInputObjectSchema } from './WorkCaseOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  legacyVariantId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  acquisitionId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  saleStage: SortOrderSchema.optional(),
  serviceStage: SortOrderSchema.optional(),
  stockStage: SortOrderSchema.optional(),
  siteChannel: SortOrderSchema.optional(),
  gender: SortOrderSchema.optional(),
  conditionGrade: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  movementType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  movementCalibre: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  serialNumber: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  yearText: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  style: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  hasBox: SortOrderSchema.optional(),
  hasPapers: SortOrderSchema.optional(),
  specStatus: SortOrderSchema.optional(),
  isImageDownloaded: SortOrderSchema.optional(),
  isContentDownloaded: SortOrderSchema.optional(),
  notes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  duplicateConfirmedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  duplicateConfirmedByUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  product: z.lazy(() => ProductOrderByWithRelationInputObjectSchema).optional(),
  watchContent: z.lazy(() => WatchContentOrderByWithRelationInputObjectSchema).optional(),
  watchPrice: z.lazy(() => WatchPriceOrderByWithRelationInputObjectSchema).optional(),
  watchSpecV2: z.lazy(() => WatchSpecV2OrderByWithRelationInputObjectSchema).optional(),
  reviewStates: z.lazy(() => WatchReviewStateOrderByRelationAggregateInputObjectSchema).optional(),
  tasks: z.lazy(() => TaskOrderByRelationAggregateInputObjectSchema).optional(),
  workCases: z.lazy(() => WorkCaseOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const WatchOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.WatchOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchOrderByWithRelationInput>;
export const WatchOrderByWithRelationInputObjectZodSchema = makeSchema();
