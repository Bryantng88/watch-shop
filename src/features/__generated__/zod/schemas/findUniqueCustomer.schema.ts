import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CustomerSelectObjectSchema as CustomerSelectObjectSchema } from './objects/CustomerSelect.schema';
import { CustomerIncludeObjectSchema as CustomerIncludeObjectSchema } from './objects/CustomerInclude.schema';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './objects/CustomerWhereUniqueInput.schema';

export const CustomerFindUniqueSchema: z.ZodType<Prisma.CustomerFindUniqueArgs> = z.object({ select: CustomerSelectObjectSchema.optional(), include: CustomerIncludeObjectSchema.optional(), where: CustomerWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CustomerFindUniqueArgs>;

export const CustomerFindUniqueZodSchema = z.object({ select: CustomerSelectObjectSchema.optional(), include: CustomerIncludeObjectSchema.optional(), where: CustomerWhereUniqueInputObjectSchema }).strict();