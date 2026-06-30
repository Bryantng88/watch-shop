import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BusinessFeedbackSelectObjectSchema as BusinessFeedbackSelectObjectSchema } from './objects/BusinessFeedbackSelect.schema';
import { BusinessFeedbackCreateManyInputObjectSchema as BusinessFeedbackCreateManyInputObjectSchema } from './objects/BusinessFeedbackCreateManyInput.schema';

export const BusinessFeedbackCreateManyAndReturnSchema: z.ZodType<Prisma.BusinessFeedbackCreateManyAndReturnArgs> = z.object({ select: BusinessFeedbackSelectObjectSchema.optional(), data: z.union([ BusinessFeedbackCreateManyInputObjectSchema, z.array(BusinessFeedbackCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.BusinessFeedbackCreateManyAndReturnArgs>;

export const BusinessFeedbackCreateManyAndReturnZodSchema = z.object({ select: BusinessFeedbackSelectObjectSchema.optional(), data: z.union([ BusinessFeedbackCreateManyInputObjectSchema, z.array(BusinessFeedbackCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();