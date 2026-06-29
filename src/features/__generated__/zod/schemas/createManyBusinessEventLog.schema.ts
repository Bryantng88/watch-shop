import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BusinessEventLogCreateManyInputObjectSchema as BusinessEventLogCreateManyInputObjectSchema } from './objects/BusinessEventLogCreateManyInput.schema';

export const BusinessEventLogCreateManySchema: z.ZodType<Prisma.BusinessEventLogCreateManyArgs> = z.object({ data: z.union([ BusinessEventLogCreateManyInputObjectSchema, z.array(BusinessEventLogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.BusinessEventLogCreateManyArgs>;

export const BusinessEventLogCreateManyZodSchema = z.object({ data: z.union([ BusinessEventLogCreateManyInputObjectSchema, z.array(BusinessEventLogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();