import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { VendorSelectObjectSchema as VendorSelectObjectSchema } from './objects/VendorSelect.schema';
import { VendorIncludeObjectSchema as VendorIncludeObjectSchema } from './objects/VendorInclude.schema';
import { VendorCreateInputObjectSchema as VendorCreateInputObjectSchema } from './objects/VendorCreateInput.schema';
import { VendorUncheckedCreateInputObjectSchema as VendorUncheckedCreateInputObjectSchema } from './objects/VendorUncheckedCreateInput.schema';

export const VendorCreateOneSchema: z.ZodType<Prisma.VendorCreateArgs> = z.object({ select: VendorSelectObjectSchema.optional(), include: VendorIncludeObjectSchema.optional(), data: z.union([VendorCreateInputObjectSchema, VendorUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.VendorCreateArgs>;

export const VendorCreateOneZodSchema = z.object({ select: VendorSelectObjectSchema.optional(), include: VendorIncludeObjectSchema.optional(), data: z.union([VendorCreateInputObjectSchema, VendorUncheckedCreateInputObjectSchema]) }).strict();