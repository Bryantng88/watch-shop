import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './objects/VendorWhereInput.schema';

export const VendorDeleteManySchema: z.ZodType<Prisma.VendorDeleteManyArgs> = z.object({ where: VendorWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.VendorDeleteManyArgs>;

export const VendorDeleteManyZodSchema = z.object({ where: VendorWhereInputObjectSchema.optional() }).strict();