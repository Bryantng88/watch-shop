import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalIssueSelectObjectSchema as TechnicalIssueSelectObjectSchema } from './objects/TechnicalIssueSelect.schema';
import { TechnicalIssueIncludeObjectSchema as TechnicalIssueIncludeObjectSchema } from './objects/TechnicalIssueInclude.schema';
import { TechnicalIssueUpdateInputObjectSchema as TechnicalIssueUpdateInputObjectSchema } from './objects/TechnicalIssueUpdateInput.schema';
import { TechnicalIssueUncheckedUpdateInputObjectSchema as TechnicalIssueUncheckedUpdateInputObjectSchema } from './objects/TechnicalIssueUncheckedUpdateInput.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './objects/TechnicalIssueWhereUniqueInput.schema';

export const TechnicalIssueUpdateOneSchema: z.ZodType<Prisma.TechnicalIssueUpdateArgs> = z.object({ select: TechnicalIssueSelectObjectSchema.optional(), include: TechnicalIssueIncludeObjectSchema.optional(), data: z.union([TechnicalIssueUpdateInputObjectSchema, TechnicalIssueUncheckedUpdateInputObjectSchema]), where: TechnicalIssueWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateArgs>;

export const TechnicalIssueUpdateOneZodSchema = z.object({ select: TechnicalIssueSelectObjectSchema.optional(), include: TechnicalIssueIncludeObjectSchema.optional(), data: z.union([TechnicalIssueUpdateInputObjectSchema, TechnicalIssueUncheckedUpdateInputObjectSchema]), where: TechnicalIssueWhereUniqueInputObjectSchema }).strict();