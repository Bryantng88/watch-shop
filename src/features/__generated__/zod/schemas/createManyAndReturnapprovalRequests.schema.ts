import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { approvalRequestsSelectObjectSchema as approvalRequestsSelectObjectSchema } from './objects/approvalRequestsSelect.schema';
import { approvalRequestsCreateManyInputObjectSchema as approvalRequestsCreateManyInputObjectSchema } from './objects/approvalRequestsCreateManyInput.schema';

export const approvalRequestsCreateManyAndReturnSchema: z.ZodType<Prisma.approvalRequestsCreateManyAndReturnArgs> = z.object({ select: approvalRequestsSelectObjectSchema.optional(), data: z.union([ approvalRequestsCreateManyInputObjectSchema, z.array(approvalRequestsCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.approvalRequestsCreateManyAndReturnArgs>;

export const approvalRequestsCreateManyAndReturnZodSchema = z.object({ select: approvalRequestsSelectObjectSchema.optional(), data: z.union([ approvalRequestsCreateManyInputObjectSchema, z.array(approvalRequestsCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();