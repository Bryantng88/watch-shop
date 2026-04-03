import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { approvalRequestsSelectObjectSchema as approvalRequestsSelectObjectSchema } from './objects/approvalRequestsSelect.schema';
import { approvalRequestsIncludeObjectSchema as approvalRequestsIncludeObjectSchema } from './objects/approvalRequestsInclude.schema';
import { approvalRequestsWhereUniqueInputObjectSchema as approvalRequestsWhereUniqueInputObjectSchema } from './objects/approvalRequestsWhereUniqueInput.schema';
import { approvalRequestsCreateInputObjectSchema as approvalRequestsCreateInputObjectSchema } from './objects/approvalRequestsCreateInput.schema';
import { approvalRequestsUncheckedCreateInputObjectSchema as approvalRequestsUncheckedCreateInputObjectSchema } from './objects/approvalRequestsUncheckedCreateInput.schema';
import { approvalRequestsUpdateInputObjectSchema as approvalRequestsUpdateInputObjectSchema } from './objects/approvalRequestsUpdateInput.schema';
import { approvalRequestsUncheckedUpdateInputObjectSchema as approvalRequestsUncheckedUpdateInputObjectSchema } from './objects/approvalRequestsUncheckedUpdateInput.schema';

export const approvalRequestsUpsertOneSchema: z.ZodType<Prisma.approvalRequestsUpsertArgs> = z.object({ select: approvalRequestsSelectObjectSchema.optional(), include: approvalRequestsIncludeObjectSchema.optional(), where: approvalRequestsWhereUniqueInputObjectSchema, create: z.union([ approvalRequestsCreateInputObjectSchema, approvalRequestsUncheckedCreateInputObjectSchema ]), update: z.union([ approvalRequestsUpdateInputObjectSchema, approvalRequestsUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.approvalRequestsUpsertArgs>;

export const approvalRequestsUpsertOneZodSchema = z.object({ select: approvalRequestsSelectObjectSchema.optional(), include: approvalRequestsIncludeObjectSchema.optional(), where: approvalRequestsWhereUniqueInputObjectSchema, create: z.union([ approvalRequestsCreateInputObjectSchema, approvalRequestsUncheckedCreateInputObjectSchema ]), update: z.union([ approvalRequestsUpdateInputObjectSchema, approvalRequestsUncheckedUpdateInputObjectSchema ]) }).strict();