import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BusinessFeedbackSelectObjectSchema as BusinessFeedbackSelectObjectSchema } from './objects/BusinessFeedbackSelect.schema';
import { BusinessFeedbackWhereUniqueInputObjectSchema as BusinessFeedbackWhereUniqueInputObjectSchema } from './objects/BusinessFeedbackWhereUniqueInput.schema';

export const BusinessFeedbackFindUniqueSchema: z.ZodType<Prisma.BusinessFeedbackFindUniqueArgs> = z.object({ select: BusinessFeedbackSelectObjectSchema.optional(),  where: BusinessFeedbackWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.BusinessFeedbackFindUniqueArgs>;

export const BusinessFeedbackFindUniqueZodSchema = z.object({ select: BusinessFeedbackSelectObjectSchema.optional(),  where: BusinessFeedbackWhereUniqueInputObjectSchema }).strict();