import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalIssueCreateManyInputObjectSchema as TechnicalIssueCreateManyInputObjectSchema } from './objects/TechnicalIssueCreateManyInput.schema';

export const TechnicalIssueCreateManySchema: z.ZodType<Prisma.TechnicalIssueCreateManyArgs> = z.object({ data: z.union([ TechnicalIssueCreateManyInputObjectSchema, z.array(TechnicalIssueCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TechnicalIssueCreateManyArgs>;

export const TechnicalIssueCreateManyZodSchema = z.object({ data: z.union([ TechnicalIssueCreateManyInputObjectSchema, z.array(TechnicalIssueCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();