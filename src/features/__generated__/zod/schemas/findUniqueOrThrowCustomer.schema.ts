import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CustomerSelectObjectSchema as CustomerSelectObjectSchema } from './objects/CustomerSelect.schema';
import { CustomerIncludeObjectSchema as CustomerIncludeObjectSchema } from './objects/CustomerInclude.schema';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './objects/CustomerWhereUniqueInput.schema';

export const CustomerFindUniqueOrThrowSchema: z.ZodType<Prisma.CustomerFindUniqueOrThrowArgs> = z.object({ select: CustomerSelectObjectSchema.optional(), include: CustomerIncludeObjectSchema.optional(), where: CustomerWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CustomerFindUniqueOrThrowArgs>;

export const CustomerFindUniqueOrThrowZodSchema = z.object({ select: CustomerSelectObjectSchema.optional(), include: CustomerIncludeObjectSchema.optional(), where: CustomerWhereUniqueInputObjectSchema }).strict();