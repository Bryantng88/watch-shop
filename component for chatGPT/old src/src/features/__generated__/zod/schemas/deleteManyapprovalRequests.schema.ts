import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { approvalRequestsWhereInputObjectSchema as approvalRequestsWhereInputObjectSchema } from './objects/approvalRequestsWhereInput.schema';

export const approvalRequestsDeleteManySchema: z.ZodType<Prisma.approvalRequestsDeleteManyArgs> = z.object({ where: approvalRequestsWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.approvalRequestsDeleteManyArgs>;

export const approvalRequestsDeleteManyZodSchema = z.object({ where: approvalRequestsWhereInputObjectSchema.optional() }).strict();