import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalIssueSelectObjectSchema as TechnicalIssueSelectObjectSchema } from './objects/TechnicalIssueSelect.schema';
import { TechnicalIssueUpdateManyMutationInputObjectSchema as TechnicalIssueUpdateManyMutationInputObjectSchema } from './objects/TechnicalIssueUpdateManyMutationInput.schema';
import { TechnicalIssueWhereInputObjectSchema as TechnicalIssueWhereInputObjectSchema } from './objects/TechnicalIssueWhereInput.schema';

export const TechnicalIssueUpdateManyAndReturnSchema: z.ZodType<Prisma.TechnicalIssueUpdateManyAndReturnArgs> = z.object({ select: TechnicalIssueSelectObjectSchema.optional(), data: TechnicalIssueUpdateManyMutationInputObjectSchema, where: TechnicalIssueWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateManyAndReturnArgs>;

export const TechnicalIssueUpdateManyAndReturnZodSchema = z.object({ select: TechnicalIssueSelectObjectSchema.optional(), data: TechnicalIssueUpdateManyMutationInputObjectSchema, where: TechnicalIssueWhereInputObjectSchema.optional() }).strict();