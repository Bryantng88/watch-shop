import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CustomerSelectObjectSchema as CustomerSelectObjectSchema } from './objects/CustomerSelect.schema';
import { CustomerIncludeObjectSchema as CustomerIncludeObjectSchema } from './objects/CustomerInclude.schema';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './objects/CustomerWhereUniqueInput.schema';
import { CustomerCreateInputObjectSchema as CustomerCreateInputObjectSchema } from './objects/CustomerCreateInput.schema';
import { CustomerUncheckedCreateInputObjectSchema as CustomerUncheckedCreateInputObjectSchema } from './objects/CustomerUncheckedCreateInput.schema';
import { CustomerUpdateInputObjectSchema as CustomerUpdateInputObjectSchema } from './objects/CustomerUpdateInput.schema';
import { CustomerUncheckedUpdateInputObjectSchema as CustomerUncheckedUpdateInputObjectSchema } from './objects/CustomerUncheckedUpdateInput.schema';

export const CustomerUpsertOneSchema: z.ZodType<Prisma.CustomerUpsertArgs> = z.object({ select: CustomerSelectObjectSchema.optional(), include: CustomerIncludeObjectSchema.optional(), where: CustomerWhereUniqueInputObjectSchema, create: z.union([ CustomerCreateInputObjectSchema, CustomerUncheckedCreateInputObjectSchema ]), update: z.union([ CustomerUpdateInputObjectSchema, CustomerUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.CustomerUpsertArgs>;

export const CustomerUpsertOneZodSchema = z.object({ select: CustomerSelectObjectSchema.optional(), include: CustomerIncludeObjectSchema.optional(), where: CustomerWhereUniqueInputObjectSchema, create: z.union([ CustomerCreateInputObjectSchema, CustomerUncheckedCreateInputObjectSchema ]), update: z.union([ CustomerUpdateInputObjectSchema, CustomerUncheckedUpdateInputObjectSchema ]) }).strict();