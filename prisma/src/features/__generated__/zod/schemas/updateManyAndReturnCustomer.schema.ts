import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CustomerSelectObjectSchema as CustomerSelectObjectSchema } from './objects/CustomerSelect.schema';
import { CustomerUpdateManyMutationInputObjectSchema as CustomerUpdateManyMutationInputObjectSchema } from './objects/CustomerUpdateManyMutationInput.schema';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './objects/CustomerWhereInput.schema';

export const CustomerUpdateManyAndReturnSchema: z.ZodType<Prisma.CustomerUpdateManyAndReturnArgs> = z.object({ select: CustomerSelectObjectSchema.optional(), data: CustomerUpdateManyMutationInputObjectSchema, where: CustomerWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CustomerUpdateManyAndReturnArgs>;

export const CustomerUpdateManyAndReturnZodSchema = z.object({ select: CustomerSelectObjectSchema.optional(), data: CustomerUpdateManyMutationInputObjectSchema, where: CustomerWhereInputObjectSchema.optional() }).strict();