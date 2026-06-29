import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BusinessEventLogSelectObjectSchema as BusinessEventLogSelectObjectSchema } from './objects/BusinessEventLogSelect.schema';
import { BusinessEventLogCreateManyInputObjectSchema as BusinessEventLogCreateManyInputObjectSchema } from './objects/BusinessEventLogCreateManyInput.schema';

export const BusinessEventLogCreateManyAndReturnSchema: z.ZodType<Prisma.BusinessEventLogCreateManyAndReturnArgs> = z.object({ select: BusinessEventLogSelectObjectSchema.optional(), data: z.union([ BusinessEventLogCreateManyInputObjectSchema, z.array(BusinessEventLogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.BusinessEventLogCreateManyAndReturnArgs>;

export const BusinessEventLogCreateManyAndReturnZodSchema = z.object({ select: BusinessEventLogSelectObjectSchema.optional(), data: z.union([ BusinessEventLogCreateManyInputObjectSchema, z.array(BusinessEventLogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();