import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalIssueUpdateManyMutationInputObjectSchema as TechnicalIssueUpdateManyMutationInputObjectSchema } from './objects/TechnicalIssueUpdateManyMutationInput.schema';
import { TechnicalIssueWhereInputObjectSchema as TechnicalIssueWhereInputObjectSchema } from './objects/TechnicalIssueWhereInput.schema';

export const TechnicalIssueUpdateManySchema: z.ZodType<Prisma.TechnicalIssueUpdateManyArgs> = z.object({ data: TechnicalIssueUpdateManyMutationInputObjectSchema, where: TechnicalIssueWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateManyArgs>;

export const TechnicalIssueUpdateManyZodSchema = z.object({ data: TechnicalIssueUpdateManyMutationInputObjectSchema, where: TechnicalIssueWhereInputObjectSchema.optional() }).strict();