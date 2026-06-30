import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BusinessFeedbackWhereInputObjectSchema as BusinessFeedbackWhereInputObjectSchema } from './objects/BusinessFeedbackWhereInput.schema';

export const BusinessFeedbackDeleteManySchema: z.ZodType<Prisma.BusinessFeedbackDeleteManyArgs> = z.object({ where: BusinessFeedbackWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BusinessFeedbackDeleteManyArgs>;

export const BusinessFeedbackDeleteManyZodSchema = z.object({ where: BusinessFeedbackWhereInputObjectSchema.optional() }).strict();