import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  key: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  roleNames: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  userIds: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  zaloGroupId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const NotificationRecipientGroupOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.NotificationRecipientGroupOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationRecipientGroupOrderByWithRelationInput>;
export const NotificationRecipientGroupOrderByWithRelationInputObjectZodSchema = makeSchema();
