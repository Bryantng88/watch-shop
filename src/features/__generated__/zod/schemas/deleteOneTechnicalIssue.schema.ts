import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalIssueSelectObjectSchema as TechnicalIssueSelectObjectSchema } from './objects/TechnicalIssueSelect.schema';
import { TechnicalIssueIncludeObjectSchema as TechnicalIssueIncludeObjectSchema } from './objects/TechnicalIssueInclude.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './objects/TechnicalIssueWhereUniqueInput.schema';

export const TechnicalIssueDeleteOneSchema: z.ZodType<Prisma.TechnicalIssueDeleteArgs> = z.object({ select: TechnicalIssueSelectObjectSchema.optional(), include: TechnicalIssueIncludeObjectSchema.optional(), where: TechnicalIssueWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TechnicalIssueDeleteArgs>;

export const TechnicalIssueDeleteOneZodSchema = z.object({ select: TechnicalIssueSelectObjectSchema.optional(), include: TechnicalIssueIncludeObjectSchema.optional(), where: TechnicalIssueWhereUniqueInputObjectSchema }).strict();