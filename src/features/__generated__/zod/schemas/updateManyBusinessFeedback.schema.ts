import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BusinessFeedbackUpdateManyMutationInputObjectSchema as BusinessFeedbackUpdateManyMutationInputObjectSchema } from './objects/BusinessFeedbackUpdateManyMutationInput.schema';
import { BusinessFeedbackWhereInputObjectSchema as BusinessFeedbackWhereInputObjectSchema } from './objects/BusinessFeedbackWhereInput.schema';

export const BusinessFeedbackUpdateManySchema: z.ZodType<Prisma.BusinessFeedbackUpdateManyArgs> = z.object({ data: BusinessFeedbackUpdateManyMutationInputObjectSchema, where: BusinessFeedbackWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BusinessFeedbackUpdateManyArgs>;

export const BusinessFeedbackUpdateManyZodSchema = z.object({ data: BusinessFeedbackUpdateManyMutationInputObjectSchema, where: BusinessFeedbackWhereInputObjectSchema.optional() }).strict();