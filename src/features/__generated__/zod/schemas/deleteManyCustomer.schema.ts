import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './objects/CustomerWhereInput.schema';

export const CustomerDeleteManySchema: z.ZodType<Prisma.CustomerDeleteManyArgs> = z.object({ where: CustomerWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CustomerDeleteManyArgs>;

export const CustomerDeleteManyZodSchema = z.object({ where: CustomerWhereInputObjectSchema.optional() }).strict();