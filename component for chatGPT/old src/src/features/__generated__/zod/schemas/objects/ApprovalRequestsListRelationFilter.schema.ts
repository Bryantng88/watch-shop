import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { approvalRequestsWhereInputObjectSchema as approvalRequestsWhereInputObjectSchema } from './approvalRequestsWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => approvalRequestsWhereInputObjectSchema).optional(),
  some: z.lazy(() => approvalRequestsWhereInputObjectSchema).optional(),
  none: z.lazy(() => approvalRequestsWhereInputObjectSchema).optional()
}).strict();
export const ApprovalRequestsListRelationFilterObjectSchema: z.ZodType<Prisma.ApprovalRequestsListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ApprovalRequestsListRelationFilter>;
export const ApprovalRequestsListRelationFilterObjectZodSchema = makeSchema();
