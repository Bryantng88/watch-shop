import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalAssessmentsSelectObjectSchema as technicalAssessmentsSelectObjectSchema } from './objects/technicalAssessmentsSelect.schema';
import { technicalAssessmentsIncludeObjectSchema as technicalAssessmentsIncludeObjectSchema } from './objects/technicalAssessmentsInclude.schema';
import { technicalAssessmentsWhereUniqueInputObjectSchema as technicalAssessmentsWhereUniqueInputObjectSchema } from './objects/technicalAssessmentsWhereUniqueInput.schema';
import { technicalAssessmentsCreateInputObjectSchema as technicalAssessmentsCreateInputObjectSchema } from './objects/technicalAssessmentsCreateInput.schema';
import { technicalAssessmentsUncheckedCreateInputObjectSchema as technicalAssessmentsUncheckedCreateInputObjectSchema } from './objects/technicalAssessmentsUncheckedCreateInput.schema';
import { technicalAssessmentsUpdateInputObjectSchema as technicalAssessmentsUpdateInputObjectSchema } from './objects/technicalAssessmentsUpdateInput.schema';
import { technicalAssessmentsUncheckedUpdateInputObjectSchema as technicalAssessmentsUncheckedUpdateInputObjectSchema } from './objects/technicalAssessmentsUncheckedUpdateInput.schema';

export const technicalAssessmentsUpsertOneSchema: z.ZodType<Prisma.technicalAssessmentsUpsertArgs> = z.object({ select: technicalAssessmentsSelectObjectSchema.optional(), include: technicalAssessmentsIncludeObjectSchema.optional(), where: technicalAssessmentsWhereUniqueInputObjectSchema, create: z.union([ technicalAssessmentsCreateInputObjectSchema, technicalAssessmentsUncheckedCreateInputObjectSchema ]), update: z.union([ technicalAssessmentsUpdateInputObjectSchema, technicalAssessmentsUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.technicalAssessmentsUpsertArgs>;

export const technicalAssessmentsUpsertOneZodSchema = z.object({ select: technicalAssessmentsSelectObjectSchema.optional(), include: technicalAssessmentsIncludeObjectSchema.optional(), where: technicalAssessmentsWhereUniqueInputObjectSchema, create: z.union([ technicalAssessmentsCreateInputObjectSchema, technicalAssessmentsUncheckedCreateInputObjectSchema ]), update: z.union([ technicalAssessmentsUpdateInputObjectSchema, technicalAssessmentsUncheckedUpdateInputObjectSchema ]) }).strict();