import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BusinessFeedbackSelectObjectSchema as BusinessFeedbackSelectObjectSchema } from './objects/BusinessFeedbackSelect.schema';
import { BusinessFeedbackWhereUniqueInputObjectSchema as BusinessFeedbackWhereUniqueInputObjectSchema } from './objects/BusinessFeedbackWhereUniqueInput.schema';

export const BusinessFeedbackFindUniqueOrThrowSchema: z.ZodType<Prisma.BusinessFeedbackFindUniqueOrThrowArgs> = z.object({ select: BusinessFeedbackSelectObjectSchema.optional(),  where: BusinessFeedbackWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.BusinessFeedbackFindUniqueOrThrowArgs>;

export const BusinessFeedbackFindUniqueOrThrowZodSchema = z.object({ select: BusinessFeedbackSelectObjectSchema.optional(),  where: BusinessFeedbackWhereUniqueInputObjectSchema }).strict();