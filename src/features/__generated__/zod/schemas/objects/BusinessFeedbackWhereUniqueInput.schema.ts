import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const BusinessFeedbackWhereUniqueInputObjectSchema: z.ZodType<Prisma.BusinessFeedbackWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.BusinessFeedbackWhereUniqueInput>;
export const BusinessFeedbackWhereUniqueInputObjectZodSchema = makeSchema();
