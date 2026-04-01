import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalIssueWhereInputObjectSchema as TechnicalIssueWhereInputObjectSchema } from './objects/TechnicalIssueWhereInput.schema';

export const TechnicalIssueDeleteManySchema: z.ZodType<Prisma.TechnicalIssueDeleteManyArgs> = z.object({ where: TechnicalIssueWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TechnicalIssueDeleteManyArgs>;

export const TechnicalIssueDeleteManyZodSchema = z.object({ where: TechnicalIssueWhereInputObjectSchema.optional() }).strict();