import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { approvalRequestsWhereInputObjectSchema as approvalRequestsWhereInputObjectSchema } from './approvalRequestsWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => approvalRequestsWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => approvalRequestsWhereInputObjectSchema).optional().nullable()
}).strict();
export const ApprovalRequestsNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.ApprovalRequestsNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ApprovalRequestsNullableScalarRelationFilter>;
export const ApprovalRequestsNullableScalarRelationFilterObjectZodSchema = makeSchema();
