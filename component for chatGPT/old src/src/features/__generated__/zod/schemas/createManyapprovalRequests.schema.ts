import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { approvalRequestsCreateManyInputObjectSchema as approvalRequestsCreateManyInputObjectSchema } from './objects/approvalRequestsCreateManyInput.schema';

export const approvalRequestsCreateManySchema: z.ZodType<Prisma.approvalRequestsCreateManyArgs> = z.object({ data: z.union([ approvalRequestsCreateManyInputObjectSchema, z.array(approvalRequestsCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.approvalRequestsCreateManyArgs>;

export const approvalRequestsCreateManyZodSchema = z.object({ data: z.union([ approvalRequestsCreateManyInputObjectSchema, z.array(approvalRequestsCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();