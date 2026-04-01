import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalIssueSelectObjectSchema as TechnicalIssueSelectObjectSchema } from './objects/TechnicalIssueSelect.schema';
import { TechnicalIssueIncludeObjectSchema as TechnicalIssueIncludeObjectSchema } from './objects/TechnicalIssueInclude.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './objects/TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueCreateInputObjectSchema as TechnicalIssueCreateInputObjectSchema } from './objects/TechnicalIssueCreateInput.schema';
import { TechnicalIssueUncheckedCreateInputObjectSchema as TechnicalIssueUncheckedCreateInputObjectSchema } from './objects/TechnicalIssueUncheckedCreateInput.schema';
import { TechnicalIssueUpdateInputObjectSchema as TechnicalIssueUpdateInputObjectSchema } from './objects/TechnicalIssueUpdateInput.schema';
import { TechnicalIssueUncheckedUpdateInputObjectSchema as TechnicalIssueUncheckedUpdateInputObjectSchema } from './objects/TechnicalIssueUncheckedUpdateInput.schema';

export const TechnicalIssueUpsertOneSchema: z.ZodType<Prisma.TechnicalIssueUpsertArgs> = z.object({ select: TechnicalIssueSelectObjectSchema.optional(), include: TechnicalIssueIncludeObjectSchema.optional(), where: TechnicalIssueWhereUniqueInputObjectSchema, create: z.union([ TechnicalIssueCreateInputObjectSchema, TechnicalIssueUncheckedCreateInputObjectSchema ]), update: z.union([ TechnicalIssueUpdateInputObjectSchema, TechnicalIssueUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.TechnicalIssueUpsertArgs>;

export const TechnicalIssueUpsertOneZodSchema = z.object({ select: TechnicalIssueSelectObjectSchema.optional(), include: TechnicalIssueIncludeObjectSchema.optional(), where: TechnicalIssueWhereUniqueInputObjectSchema, create: z.union([ TechnicalIssueCreateInputObjectSchema, TechnicalIssueUncheckedCreateInputObjectSchema ]), update: z.union([ TechnicalIssueUpdateInputObjectSchema, TechnicalIssueUncheckedUpdateInputObjectSchema ]) }).strict();