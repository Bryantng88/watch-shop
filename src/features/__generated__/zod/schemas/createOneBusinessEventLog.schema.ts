import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BusinessEventLogSelectObjectSchema as BusinessEventLogSelectObjectSchema } from './objects/BusinessEventLogSelect.schema';
import { BusinessEventLogIncludeObjectSchema as BusinessEventLogIncludeObjectSchema } from './objects/BusinessEventLogInclude.schema';
import { BusinessEventLogCreateInputObjectSchema as BusinessEventLogCreateInputObjectSchema } from './objects/BusinessEventLogCreateInput.schema';
import { BusinessEventLogUncheckedCreateInputObjectSchema as BusinessEventLogUncheckedCreateInputObjectSchema } from './objects/BusinessEventLogUncheckedCreateInput.schema';

export const BusinessEventLogCreateOneSchema: z.ZodType<Prisma.BusinessEventLogCreateArgs> = z.object({ select: BusinessEventLogSelectObjectSchema.optional(), include: BusinessEventLogIncludeObjectSchema.optional(), data: z.union([BusinessEventLogCreateInputObjectSchema, BusinessEventLogUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.BusinessEventLogCreateArgs>;

export const BusinessEventLogCreateOneZodSchema = z.object({ select: BusinessEventLogSelectObjectSchema.optional(), include: BusinessEventLogIncludeObjectSchema.optional(), data: z.union([BusinessEventLogCreateInputObjectSchema, BusinessEventLogUncheckedCreateInputObjectSchema]) }).strict();