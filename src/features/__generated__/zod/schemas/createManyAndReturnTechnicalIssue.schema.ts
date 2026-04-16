import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalIssueSelectObjectSchema as TechnicalIssueSelectObjectSchema } from './objects/TechnicalIssueSelect.schema';
import { TechnicalIssueCreateManyInputObjectSchema as TechnicalIssueCreateManyInputObjectSchema } from './objects/TechnicalIssueCreateManyInput.schema';

export const TechnicalIssueCreateManyAndReturnSchema: z.ZodType<Prisma.TechnicalIssueCreateManyAndReturnArgs> = z.object({ select: TechnicalIssueSelectObjectSchema.optional(), data: z.union([ TechnicalIssueCreateManyInputObjectSchema, z.array(TechnicalIssueCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TechnicalIssueCreateManyAndReturnArgs>;

export const TechnicalIssueCreateManyAndReturnZodSchema = z.object({ select: TechnicalIssueSelectObjectSchema.optional(), data: z.union([ TechnicalIssueCreateManyInputObjectSchema, z.array(TechnicalIssueCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();