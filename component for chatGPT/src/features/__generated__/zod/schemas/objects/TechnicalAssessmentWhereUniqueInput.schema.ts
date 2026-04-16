import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  serviceRequestId: z.string().optional()
}).strict();
export const TechnicalAssessmentWhereUniqueInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentWhereUniqueInput>;
export const TechnicalAssessmentWhereUniqueInputObjectZodSchema = makeSchema();
