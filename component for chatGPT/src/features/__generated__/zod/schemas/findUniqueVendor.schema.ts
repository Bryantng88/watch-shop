import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { VendorSelectObjectSchema as VendorSelectObjectSchema } from './objects/VendorSelect.schema';
import { VendorIncludeObjectSchema as VendorIncludeObjectSchema } from './objects/VendorInclude.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './objects/VendorWhereUniqueInput.schema';

export const VendorFindUniqueSchema: z.ZodType<Prisma.VendorFindUniqueArgs> = z.object({ select: VendorSelectObjectSchema.optional(), include: VendorIncludeObjectSchema.optional(), where: VendorWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.VendorFindUniqueArgs>;

export const VendorFindUniqueZodSchema = z.object({ select: VendorSelectObjectSchema.optional(), include: VendorIncludeObjectSchema.optional(), where: VendorWhereUniqueInputObjectSchema }).strict();