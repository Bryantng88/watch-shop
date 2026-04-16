import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { VendorSelectObjectSchema as VendorSelectObjectSchema } from './objects/VendorSelect.schema';
import { VendorIncludeObjectSchema as VendorIncludeObjectSchema } from './objects/VendorInclude.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './objects/VendorWhereUniqueInput.schema';

export const VendorDeleteOneSchema: z.ZodType<Prisma.VendorDeleteArgs> = z.object({ select: VendorSelectObjectSchema.optional(), include: VendorIncludeObjectSchema.optional(), where: VendorWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.VendorDeleteArgs>;

export const VendorDeleteOneZodSchema = z.object({ select: VendorSelectObjectSchema.optional(), include: VendorIncludeObjectSchema.optional(), where: VendorWhereUniqueInputObjectSchema }).strict();