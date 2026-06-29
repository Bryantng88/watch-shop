import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BusinessEventLogSelectObjectSchema as BusinessEventLogSelectObjectSchema } from './objects/BusinessEventLogSelect.schema';
import { BusinessEventLogIncludeObjectSchema as BusinessEventLogIncludeObjectSchema } from './objects/BusinessEventLogInclude.schema';
import { BusinessEventLogWhereUniqueInputObjectSchema as BusinessEventLogWhereUniqueInputObjectSchema } from './objects/BusinessEventLogWhereUniqueInput.schema';
import { BusinessEventLogCreateInputObjectSchema as BusinessEventLogCreateInputObjectSchema } from './objects/BusinessEventLogCreateInput.schema';
import { BusinessEventLogUncheckedCreateInputObjectSchema as BusinessEventLogUncheckedCreateInputObjectSchema } from './objects/BusinessEventLogUncheckedCreateInput.schema';
import { BusinessEventLogUpdateInputObjectSchema as BusinessEventLogUpdateInputObjectSchema } from './objects/BusinessEventLogUpdateInput.schema';
import { BusinessEventLogUncheckedUpdateInputObjectSchema as BusinessEventLogUncheckedUpdateInputObjectSchema } from './objects/BusinessEventLogUncheckedUpdateInput.schema';

export const BusinessEventLogUpsertOneSchema: z.ZodType<Prisma.BusinessEventLogUpsertArgs> = z.object({ select: BusinessEventLogSelectObjectSchema.optional(), include: BusinessEventLogIncludeObjectSchema.optional(), where: BusinessEventLogWhereUniqueInputObjectSchema, create: z.union([ BusinessEventLogCreateInputObjectSchema, BusinessEventLogUncheckedCreateInputObjectSchema ]), update: z.union([ BusinessEventLogUpdateInputObjectSchema, BusinessEventLogUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.BusinessEventLogUpsertArgs>;

export const BusinessEventLogUpsertOneZodSchema = z.object({ select: BusinessEventLogSelectObjectSchema.optional(), include: BusinessEventLogIncludeObjectSchema.optional(), where: BusinessEventLogWhereUniqueInputObjectSchema, create: z.union([ BusinessEventLogCreateInputObjectSchema, BusinessEventLogUncheckedCreateInputObjectSchema ]), update: z.union([ BusinessEventLogUpdateInputObjectSchema, BusinessEventLogUncheckedUpdateInputObjectSchema ]) }).strict();