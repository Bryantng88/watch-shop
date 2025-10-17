import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { VendorUpdateManyMutationInputObjectSchema as VendorUpdateManyMutationInputObjectSchema } from './objects/VendorUpdateManyMutationInput.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './objects/VendorWhereInput.schema';

export const VendorUpdateManySchema: z.ZodType<Prisma.VendorUpdateManyArgs> = z.object({ data: VendorUpdateManyMutationInputObjectSchema, where: VendorWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.VendorUpdateManyArgs>;

export const VendorUpdateManyZodSchema = z.object({ data: VendorUpdateManyMutationInputObjectSchema, where: VendorWhereInputObjectSchema.optional() }).strict();