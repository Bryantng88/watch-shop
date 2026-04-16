import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  serviceRequestId: z.string().optional()
}).strict();
export const technicalAssessmentsWhereUniqueInputObjectSchema: z.ZodType<Prisma.technicalAssessmentsWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalAssessmentsWhereUniqueInput>;
export const technicalAssessmentsWhereUniqueInputObjectZodSchema = makeSchema();
