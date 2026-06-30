import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BusinessFeedbackSelectObjectSchema as BusinessFeedbackSelectObjectSchema } from './objects/BusinessFeedbackSelect.schema';
import { BusinessFeedbackCreateInputObjectSchema as BusinessFeedbackCreateInputObjectSchema } from './objects/BusinessFeedbackCreateInput.schema';
import { BusinessFeedbackUncheckedCreateInputObjectSchema as BusinessFeedbackUncheckedCreateInputObjectSchema } from './objects/BusinessFeedbackUncheckedCreateInput.schema';

export const BusinessFeedbackCreateOneSchema: z.ZodType<Prisma.BusinessFeedbackCreateArgs> = z.object({ select: BusinessFeedbackSelectObjectSchema.optional(),  data: z.union([BusinessFeedbackCreateInputObjectSchema, BusinessFeedbackUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.BusinessFeedbackCreateArgs>;

export const BusinessFeedbackCreateOneZodSchema = z.object({ select: BusinessFeedbackSelectObjectSchema.optional(),  data: z.union([BusinessFeedbackCreateInputObjectSchema, BusinessFeedbackUncheckedCreateInputObjectSchema]) }).strict();