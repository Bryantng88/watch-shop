import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { approvalRequestsSelectObjectSchema as approvalRequestsSelectObjectSchema } from './objects/approvalRequestsSelect.schema';
import { approvalRequestsUpdateManyMutationInputObjectSchema as approvalRequestsUpdateManyMutationInputObjectSchema } from './objects/approvalRequestsUpdateManyMutationInput.schema';
import { approvalRequestsWhereInputObjectSchema as approvalRequestsWhereInputObjectSchema } from './objects/approvalRequestsWhereInput.schema';

export const approvalRequestsUpdateManyAndReturnSchema: z.ZodType<Prisma.approvalRequestsUpdateManyAndReturnArgs> = z.object({ select: approvalRequestsSelectObjectSchema.optional(), data: approvalRequestsUpdateManyMutationInputObjectSchema, where: approvalRequestsWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.approvalRequestsUpdateManyAndReturnArgs>;

export const approvalRequestsUpdateManyAndReturnZodSchema = z.object({ select: approvalRequestsSelectObjectSchema.optional(), data: approvalRequestsUpdateManyMutationInputObjectSchema, where: approvalRequestsWhereInputObjectSchema.optional() }).strict();