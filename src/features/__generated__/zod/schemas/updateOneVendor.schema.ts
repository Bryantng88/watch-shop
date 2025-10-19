import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { VendorSelectObjectSchema as VendorSelectObjectSchema } from './objects/VendorSelect.schema';
import { VendorIncludeObjectSchema as VendorIncludeObjectSchema } from './objects/VendorInclude.schema';
import { VendorUpdateInputObjectSchema as VendorUpdateInputObjectSchema } from './objects/VendorUpdateInput.schema';
import { VendorUncheckedUpdateInputObjectSchema as VendorUncheckedUpdateInputObjectSchema } from './objects/VendorUncheckedUpdateInput.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './objects/VendorWhereUniqueInput.schema';

export const VendorUpdateOneSchema: z.ZodType<Prisma.VendorUpdateArgs> = z.object({ select: VendorSelectObjectSchema.optional(), include: VendorIncludeObjectSchema.optional(), data: z.union([VendorUpdateInputObjectSchema, VendorUncheckedUpdateInputObjectSchema]), where: VendorWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.VendorUpdateArgs>;

export const VendorUpdateOneZodSchema = z.object({ select: VendorSelectObjectSchema.optional(), include: VendorIncludeObjectSchema.optional(), data: z.union([VendorUpdateInputObjectSchema, VendorUncheckedUpdateInputObjectSchema]), where: VendorWhereUniqueInputObjectSchema }).strict();