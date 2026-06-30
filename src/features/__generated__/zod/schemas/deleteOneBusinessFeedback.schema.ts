import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BusinessFeedbackSelectObjectSchema as BusinessFeedbackSelectObjectSchema } from './objects/BusinessFeedbackSelect.schema';
import { BusinessFeedbackWhereUniqueInputObjectSchema as BusinessFeedbackWhereUniqueInputObjectSchema } from './objects/BusinessFeedbackWhereUniqueInput.schema';

export const BusinessFeedbackDeleteOneSchema: z.ZodType<Prisma.BusinessFeedbackDeleteArgs> = z.object({ select: BusinessFeedbackSelectObjectSchema.optional(),  where: BusinessFeedbackWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.BusinessFeedbackDeleteArgs>;

export const BusinessFeedbackDeleteOneZodSchema = z.object({ select: BusinessFeedbackSelectObjectSchema.optional(),  where: BusinessFeedbackWhereUniqueInputObjectSchema }).strict();