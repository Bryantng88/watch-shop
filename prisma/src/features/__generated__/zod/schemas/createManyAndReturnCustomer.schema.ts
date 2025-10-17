import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CustomerSelectObjectSchema as CustomerSelectObjectSchema } from './objects/CustomerSelect.schema';
import { CustomerCreateManyInputObjectSchema as CustomerCreateManyInputObjectSchema } from './objects/CustomerCreateManyInput.schema';

export const CustomerCreateManyAndReturnSchema: z.ZodType<Prisma.CustomerCreateManyAndReturnArgs> = z.object({ select: CustomerSelectObjectSchema.optional(), data: z.union([ CustomerCreateManyInputObjectSchema, z.array(CustomerCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.CustomerCreateManyAndReturnArgs>;

export const CustomerCreateManyAndReturnZodSchema = z.object({ select: CustomerSelectObjectSchema.optional(), data: z.union([ CustomerCreateManyInputObjectSchema, z.array(CustomerCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();