import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const TechnicalIssueWhereUniqueInputObjectSchema: z.ZodType<Prisma.TechnicalIssueWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueWhereUniqueInput>;
export const TechnicalIssueWhereUniqueInputObjectZodSchema = makeSchema();
