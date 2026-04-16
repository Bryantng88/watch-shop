import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { approvalRequestsSelectObjectSchema as approvalRequestsSelectObjectSchema } from './objects/approvalRequestsSelect.schema';
import { approvalRequestsIncludeObjectSchema as approvalRequestsIncludeObjectSchema } from './objects/approvalRequestsInclude.schema';
import { approvalRequestsUpdateInputObjectSchema as approvalRequestsUpdateInputObjectSchema } from './objects/approvalRequestsUpdateInput.schema';
import { approvalRequestsUncheckedUpdateInputObjectSchema as approvalRequestsUncheckedUpdateInputObjectSchema } from './objects/approvalRequestsUncheckedUpdateInput.schema';
import { approvalRequestsWhereUniqueInputObjectSchema as approvalRequestsWhereUniqueInputObjectSchema } from './objects/approvalRequestsWhereUniqueInput.schema';

export const approvalRequestsUpdateOneSchema: z.ZodType<Prisma.approvalRequestsUpdateArgs> = z.object({ select: approvalRequestsSelectObjectSchema.optional(), include: approvalRequestsIncludeObjectSchema.optional(), data: z.union([approvalRequestsUpdateInputObjectSchema, approvalRequestsUncheckedUpdateInputObjectSchema]), where: approvalRequestsWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.approvalRequestsUpdateArgs>;

export const approvalRequestsUpdateOneZodSchema = z.object({ select: approvalRequestsSelectObjectSchema.optional(), include: approvalRequestsIncludeObjectSchema.optional(), data: z.union([approvalRequestsUpdateInputObjectSchema, approvalRequestsUncheckedUpdateInputObjectSchema]), where: approvalRequestsWhereUniqueInputObjectSchema }).strict();