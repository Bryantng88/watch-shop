import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { approvalRequestsSelectObjectSchema as approvalRequestsSelectObjectSchema } from './objects/approvalRequestsSelect.schema';
import { approvalRequestsIncludeObjectSchema as approvalRequestsIncludeObjectSchema } from './objects/approvalRequestsInclude.schema';
import { approvalRequestsCreateInputObjectSchema as approvalRequestsCreateInputObjectSchema } from './objects/approvalRequestsCreateInput.schema';
import { approvalRequestsUncheckedCreateInputObjectSchema as approvalRequestsUncheckedCreateInputObjectSchema } from './objects/approvalRequestsUncheckedCreateInput.schema';

export const approvalRequestsCreateOneSchema: z.ZodType<Prisma.approvalRequestsCreateArgs> = z.object({ select: approvalRequestsSelectObjectSchema.optional(), include: approvalRequestsIncludeObjectSchema.optional(), data: z.union([approvalRequestsCreateInputObjectSchema, approvalRequestsUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.approvalRequestsCreateArgs>;

export const approvalRequestsCreateOneZodSchema = z.object({ select: approvalRequestsSelectObjectSchema.optional(), include: approvalRequestsIncludeObjectSchema.optional(), data: z.union([approvalRequestsCreateInputObjectSchema, approvalRequestsUncheckedCreateInputObjectSchema]) }).strict();