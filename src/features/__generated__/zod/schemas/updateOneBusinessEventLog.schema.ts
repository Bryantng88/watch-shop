import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BusinessEventLogSelectObjectSchema as BusinessEventLogSelectObjectSchema } from './objects/BusinessEventLogSelect.schema';
import { BusinessEventLogIncludeObjectSchema as BusinessEventLogIncludeObjectSchema } from './objects/BusinessEventLogInclude.schema';
import { BusinessEventLogUpdateInputObjectSchema as BusinessEventLogUpdateInputObjectSchema } from './objects/BusinessEventLogUpdateInput.schema';
import { BusinessEventLogUncheckedUpdateInputObjectSchema as BusinessEventLogUncheckedUpdateInputObjectSchema } from './objects/BusinessEventLogUncheckedUpdateInput.schema';
import { BusinessEventLogWhereUniqueInputObjectSchema as BusinessEventLogWhereUniqueInputObjectSchema } from './objects/BusinessEventLogWhereUniqueInput.schema';

export const BusinessEventLogUpdateOneSchema: z.ZodType<Prisma.BusinessEventLogUpdateArgs> = z.object({ select: BusinessEventLogSelectObjectSchema.optional(), include: BusinessEventLogIncludeObjectSchema.optional(), data: z.union([BusinessEventLogUpdateInputObjectSchema, BusinessEventLogUncheckedUpdateInputObjectSchema]), where: BusinessEventLogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.BusinessEventLogUpdateArgs>;

export const BusinessEventLogUpdateOneZodSchema = z.object({ select: BusinessEventLogSelectObjectSchema.optional(), include: BusinessEventLogIncludeObjectSchema.optional(), data: z.union([BusinessEventLogUpdateInputObjectSchema, BusinessEventLogUncheckedUpdateInputObjectSchema]), where: BusinessEventLogWhereUniqueInputObjectSchema }).strict();