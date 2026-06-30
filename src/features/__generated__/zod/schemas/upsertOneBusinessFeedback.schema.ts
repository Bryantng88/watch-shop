import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BusinessFeedbackSelectObjectSchema as BusinessFeedbackSelectObjectSchema } from './objects/BusinessFeedbackSelect.schema';
import { BusinessFeedbackWhereUniqueInputObjectSchema as BusinessFeedbackWhereUniqueInputObjectSchema } from './objects/BusinessFeedbackWhereUniqueInput.schema';
import { BusinessFeedbackCreateInputObjectSchema as BusinessFeedbackCreateInputObjectSchema } from './objects/BusinessFeedbackCreateInput.schema';
import { BusinessFeedbackUncheckedCreateInputObjectSchema as BusinessFeedbackUncheckedCreateInputObjectSchema } from './objects/BusinessFeedbackUncheckedCreateInput.schema';
import { BusinessFeedbackUpdateInputObjectSchema as BusinessFeedbackUpdateInputObjectSchema } from './objects/BusinessFeedbackUpdateInput.schema';
import { BusinessFeedbackUncheckedUpdateInputObjectSchema as BusinessFeedbackUncheckedUpdateInputObjectSchema } from './objects/BusinessFeedbackUncheckedUpdateInput.schema';

export const BusinessFeedbackUpsertOneSchema: z.ZodType<Prisma.BusinessFeedbackUpsertArgs> = z.object({ select: BusinessFeedbackSelectObjectSchema.optional(),  where: BusinessFeedbackWhereUniqueInputObjectSchema, create: z.union([ BusinessFeedbackCreateInputObjectSchema, BusinessFeedbackUncheckedCreateInputObjectSchema ]), update: z.union([ BusinessFeedbackUpdateInputObjectSchema, BusinessFeedbackUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.BusinessFeedbackUpsertArgs>;

export const BusinessFeedbackUpsertOneZodSchema = z.object({ select: BusinessFeedbackSelectObjectSchema.optional(),  where: BusinessFeedbackWhereUniqueInputObjectSchema, create: z.union([ BusinessFeedbackCreateInputObjectSchema, BusinessFeedbackUncheckedCreateInputObjectSchema ]), update: z.union([ BusinessFeedbackUpdateInputObjectSchema, BusinessFeedbackUncheckedUpdateInputObjectSchema ]) }).strict();