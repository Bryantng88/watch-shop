import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BusinessFeedbackSelectObjectSchema as BusinessFeedbackSelectObjectSchema } from './objects/BusinessFeedbackSelect.schema';
import { BusinessFeedbackUpdateInputObjectSchema as BusinessFeedbackUpdateInputObjectSchema } from './objects/BusinessFeedbackUpdateInput.schema';
import { BusinessFeedbackUncheckedUpdateInputObjectSchema as BusinessFeedbackUncheckedUpdateInputObjectSchema } from './objects/BusinessFeedbackUncheckedUpdateInput.schema';
import { BusinessFeedbackWhereUniqueInputObjectSchema as BusinessFeedbackWhereUniqueInputObjectSchema } from './objects/BusinessFeedbackWhereUniqueInput.schema';

export const BusinessFeedbackUpdateOneSchema: z.ZodType<Prisma.BusinessFeedbackUpdateArgs> = z.object({ select: BusinessFeedbackSelectObjectSchema.optional(),  data: z.union([BusinessFeedbackUpdateInputObjectSchema, BusinessFeedbackUncheckedUpdateInputObjectSchema]), where: BusinessFeedbackWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.BusinessFeedbackUpdateArgs>;

export const BusinessFeedbackUpdateOneZodSchema = z.object({ select: BusinessFeedbackSelectObjectSchema.optional(),  data: z.union([BusinessFeedbackUpdateInputObjectSchema, BusinessFeedbackUncheckedUpdateInputObjectSchema]), where: BusinessFeedbackWhereUniqueInputObjectSchema }).strict();