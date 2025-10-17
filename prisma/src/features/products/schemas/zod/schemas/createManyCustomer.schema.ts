import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CustomerCreateManyInputObjectSchema as CustomerCreateManyInputObjectSchema } from './objects/CustomerCreateManyInput.schema';

export const CustomerCreateManySchema: z.ZodType<Prisma.CustomerCreateManyArgs> = z.object({ data: z.union([ CustomerCreateManyInputObjectSchema, z.array(CustomerCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.CustomerCreateManyArgs>;

export const CustomerCreateManyZodSchema = z.object({ data: z.union([ CustomerCreateManyInputObjectSchema, z.array(CustomerCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();