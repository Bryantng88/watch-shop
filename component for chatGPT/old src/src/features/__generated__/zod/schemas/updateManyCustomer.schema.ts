import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CustomerUpdateManyMutationInputObjectSchema as CustomerUpdateManyMutationInputObjectSchema } from './objects/CustomerUpdateManyMutationInput.schema';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './objects/CustomerWhereInput.schema';

export const CustomerUpdateManySchema: z.ZodType<Prisma.CustomerUpdateManyArgs> = z.object({ data: CustomerUpdateManyMutationInputObjectSchema, where: CustomerWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CustomerUpdateManyArgs>;

export const CustomerUpdateManyZodSchema = z.object({ data: CustomerUpdateManyMutationInputObjectSchema, where: CustomerWhereInputObjectSchema.optional() }).strict();