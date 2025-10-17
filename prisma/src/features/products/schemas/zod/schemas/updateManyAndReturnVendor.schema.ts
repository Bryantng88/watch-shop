import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { VendorSelectObjectSchema as VendorSelectObjectSchema } from './objects/VendorSelect.schema';
import { VendorUpdateManyMutationInputObjectSchema as VendorUpdateManyMutationInputObjectSchema } from './objects/VendorUpdateManyMutationInput.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './objects/VendorWhereInput.schema';

export const VendorUpdateManyAndReturnSchema: z.ZodType<Prisma.VendorUpdateManyAndReturnArgs> = z.object({ select: VendorSelectObjectSchema.optional(), data: VendorUpdateManyMutationInputObjectSchema, where: VendorWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.VendorUpdateManyAndReturnArgs>;

export const VendorUpdateManyAndReturnZodSchema = z.object({ select: VendorSelectObjectSchema.optional(), data: VendorUpdateManyMutationInputObjectSchema, where: VendorWhereInputObjectSchema.optional() }).strict();