import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalIssueSelectObjectSchema as TechnicalIssueSelectObjectSchema } from './objects/TechnicalIssueSelect.schema';
import { TechnicalIssueIncludeObjectSchema as TechnicalIssueIncludeObjectSchema } from './objects/TechnicalIssueInclude.schema';
import { TechnicalIssueCreateInputObjectSchema as TechnicalIssueCreateInputObjectSchema } from './objects/TechnicalIssueCreateInput.schema';
import { TechnicalIssueUncheckedCreateInputObjectSchema as TechnicalIssueUncheckedCreateInputObjectSchema } from './objects/TechnicalIssueUncheckedCreateInput.schema';

export const TechnicalIssueCreateOneSchema: z.ZodType<Prisma.TechnicalIssueCreateArgs> = z.object({ select: TechnicalIssueSelectObjectSchema.optional(), include: TechnicalIssueIncludeObjectSchema.optional(), data: z.union([TechnicalIssueCreateInputObjectSchema, TechnicalIssueUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.TechnicalIssueCreateArgs>;

export const TechnicalIssueCreateOneZodSchema = z.object({ select: TechnicalIssueSelectObjectSchema.optional(), include: TechnicalIssueIncludeObjectSchema.optional(), data: z.union([TechnicalIssueCreateInputObjectSchema, TechnicalIssueUncheckedCreateInputObjectSchema]) }).strict();