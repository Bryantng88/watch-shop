import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CustomerSelectObjectSchema as CustomerSelectObjectSchema } from './objects/CustomerSelect.schema';
import { CustomerIncludeObjectSchema as CustomerIncludeObjectSchema } from './objects/CustomerInclude.schema';
import { CustomerUpdateInputObjectSchema as CustomerUpdateInputObjectSchema } from './objects/CustomerUpdateInput.schema';
import { CustomerUncheckedUpdateInputObjectSchema as CustomerUncheckedUpdateInputObjectSchema } from './objects/CustomerUncheckedUpdateInput.schema';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './objects/CustomerWhereUniqueInput.schema';

export const CustomerUpdateOneSchema: z.ZodType<Prisma.CustomerUpdateArgs> = z.object({ select: CustomerSelectObjectSchema.optional(), include: CustomerIncludeObjectSchema.optional(), data: z.union([CustomerUpdateInputObjectSchema, CustomerUncheckedUpdateInputObjectSchema]), where: CustomerWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CustomerUpdateArgs>;

export const CustomerUpdateOneZodSchema = z.object({ select: CustomerSelectObjectSchema.optional(), include: CustomerIncludeObjectSchema.optional(), data: z.union([CustomerUpdateInputObjectSchema, CustomerUncheckedUpdateInputObjectSchema]), where: CustomerWhereUniqueInputObjectSchema }).strict();