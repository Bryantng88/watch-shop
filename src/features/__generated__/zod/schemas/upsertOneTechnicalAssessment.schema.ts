import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalAssessmentSelectObjectSchema as TechnicalAssessmentSelectObjectSchema } from './objects/TechnicalAssessmentSelect.schema';
import { TechnicalAssessmentIncludeObjectSchema as TechnicalAssessmentIncludeObjectSchema } from './objects/TechnicalAssessmentInclude.schema';
import { TechnicalAssessmentWhereUniqueInputObjectSchema as TechnicalAssessmentWhereUniqueInputObjectSchema } from './objects/TechnicalAssessmentWhereUniqueInput.schema';
import { TechnicalAssessmentCreateInputObjectSchema as TechnicalAssessmentCreateInputObjectSchema } from './objects/TechnicalAssessmentCreateInput.schema';
import { TechnicalAssessmentUncheckedCreateInputObjectSchema as TechnicalAssessmentUncheckedCreateInputObjectSchema } from './objects/TechnicalAssessmentUncheckedCreateInput.schema';
import { TechnicalAssessmentUpdateInputObjectSchema as TechnicalAssessmentUpdateInputObjectSchema } from './objects/TechnicalAssessmentUpdateInput.schema';
import { TechnicalAssessmentUncheckedUpdateInputObjectSchema as TechnicalAssessmentUncheckedUpdateInputObjectSchema } from './objects/TechnicalAssessmentUncheckedUpdateInput.schema';

export const TechnicalAssessmentUpsertOneSchema: z.ZodType<Prisma.TechnicalAssessmentUpsertArgs> = z.object({ select: TechnicalAssessmentSelectObjectSchema.optional(), include: TechnicalAssessmentIncludeObjectSchema.optional(), where: TechnicalAssessmentWhereUniqueInputObjectSchema, create: z.union([ TechnicalAssessmentCreateInputObjectSchema, TechnicalAssessmentUncheckedCreateInputObjectSchema ]), update: z.union([ TechnicalAssessmentUpdateInputObjectSchema, TechnicalAssessmentUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.TechnicalAssessmentUpsertArgs>;

export const TechnicalAssessmentUpsertOneZodSchema = z.object({ select: TechnicalAssessmentSelectObjectSchema.optional(), include: TechnicalAssessmentIncludeObjectSchema.optional(), where: TechnicalAssessmentWhereUniqueInputObjectSchema, create: z.union([ TechnicalAssessmentCreateInputObjectSchema, TechnicalAssessmentUncheckedCreateInputObjectSchema ]), update: z.union([ TechnicalAssessmentUpdateInputObjectSchema, TechnicalAssessmentUncheckedUpdateInputObjectSchema ]) }).strict();