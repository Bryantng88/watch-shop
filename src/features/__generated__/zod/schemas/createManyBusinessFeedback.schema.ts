import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BusinessFeedbackCreateManyInputObjectSchema as BusinessFeedbackCreateManyInputObjectSchema } from './objects/BusinessFeedbackCreateManyInput.schema';

export const BusinessFeedbackCreateManySchema: z.ZodType<Prisma.BusinessFeedbackCreateManyArgs> = z.object({ data: z.union([ BusinessFeedbackCreateManyInputObjectSchema, z.array(BusinessFeedbackCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.BusinessFeedbackCreateManyArgs>;

export const BusinessFeedbackCreateManyZodSchema = z.object({ data: z.union([ BusinessFeedbackCreateManyInputObjectSchema, z.array(BusinessFeedbackCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();