import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { approvalRequestsUpdateManyMutationInputObjectSchema as approvalRequestsUpdateManyMutationInputObjectSchema } from './objects/approvalRequestsUpdateManyMutationInput.schema';
import { approvalRequestsWhereInputObjectSchema as approvalRequestsWhereInputObjectSchema } from './objects/approvalRequestsWhereInput.schema';

export const approvalRequestsUpdateManySchema: z.ZodType<Prisma.approvalRequestsUpdateManyArgs> = z.object({ data: approvalRequestsUpdateManyMutationInputObjectSchema, where: approvalRequestsWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.approvalRequestsUpdateManyArgs>;

export const approvalRequestsUpdateManyZodSchema = z.object({ data: approvalRequestsUpdateManyMutationInputObjectSchema, where: approvalRequestsWhereInputObjectSchema.optional() }).strict();