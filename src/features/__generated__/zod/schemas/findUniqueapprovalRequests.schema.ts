import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { approvalRequestsSelectObjectSchema as approvalRequestsSelectObjectSchema } from './objects/approvalRequestsSelect.schema';
import { approvalRequestsIncludeObjectSchema as approvalRequestsIncludeObjectSchema } from './objects/approvalRequestsInclude.schema';
import { approvalRequestsWhereUniqueInputObjectSchema as approvalRequestsWhereUniqueInputObjectSchema } from './objects/approvalRequestsWhereUniqueInput.schema';

export const approvalRequestsFindUniqueSchema: z.ZodType<Prisma.approvalRequestsFindUniqueArgs> = z.object({ select: approvalRequestsSelectObjectSchema.optional(), include: approvalRequestsIncludeObjectSchema.optional(), where: approvalRequestsWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.approvalRequestsFindUniqueArgs>;

export const approvalRequestsFindUniqueZodSchema = z.object({ select: approvalRequestsSelectObjectSchema.optional(), include: approvalRequestsIncludeObjectSchema.optional(), where: approvalRequestsWhereUniqueInputObjectSchema }).strict();