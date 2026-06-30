import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BusinessFeedbackSelectObjectSchema as BusinessFeedbackSelectObjectSchema } from './objects/BusinessFeedbackSelect.schema';
import { BusinessFeedbackUpdateManyMutationInputObjectSchema as BusinessFeedbackUpdateManyMutationInputObjectSchema } from './objects/BusinessFeedbackUpdateManyMutationInput.schema';
import { BusinessFeedbackWhereInputObjectSchema as BusinessFeedbackWhereInputObjectSchema } from './objects/BusinessFeedbackWhereInput.schema';

export const BusinessFeedbackUpdateManyAndReturnSchema: z.ZodType<Prisma.BusinessFeedbackUpdateManyAndReturnArgs> = z.object({ select: BusinessFeedbackSelectObjectSchema.optional(), data: BusinessFeedbackUpdateManyMutationInputObjectSchema, where: BusinessFeedbackWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BusinessFeedbackUpdateManyAndReturnArgs>;

export const BusinessFeedbackUpdateManyAndReturnZodSchema = z.object({ select: BusinessFeedbackSelectObjectSchema.optional(), data: BusinessFeedbackUpdateManyMutationInputObjectSchema, where: BusinessFeedbackWhereInputObjectSchema.optional() }).strict();