import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { VendorSelectObjectSchema as VendorSelectObjectSchema } from './objects/VendorSelect.schema';
import { VendorIncludeObjectSchema as VendorIncludeObjectSchema } from './objects/VendorInclude.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './objects/VendorWhereUniqueInput.schema';
import { VendorCreateInputObjectSchema as VendorCreateInputObjectSchema } from './objects/VendorCreateInput.schema';
import { VendorUncheckedCreateInputObjectSchema as VendorUncheckedCreateInputObjectSchema } from './objects/VendorUncheckedCreateInput.schema';
import { VendorUpdateInputObjectSchema as VendorUpdateInputObjectSchema } from './objects/VendorUpdateInput.schema';
import { VendorUncheckedUpdateInputObjectSchema as VendorUncheckedUpdateInputObjectSchema } from './objects/VendorUncheckedUpdateInput.schema';

export const VendorUpsertOneSchema: z.ZodType<Prisma.VendorUpsertArgs> = z.object({ select: VendorSelectObjectSchema.optional(), include: VendorIncludeObjectSchema.optional(), where: VendorWhereUniqueInputObjectSchema, create: z.union([ VendorCreateInputObjectSchema, VendorUncheckedCreateInputObjectSchema ]), update: z.union([ VendorUpdateInputObjectSchema, VendorUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.VendorUpsertArgs>;

export const VendorUpsertOneZodSchema = z.object({ select: VendorSelectObjectSchema.optional(), include: VendorIncludeObjectSchema.optional(), where: VendorWhereUniqueInputObjectSchema, create: z.union([ VendorCreateInputObjectSchema, VendorUncheckedCreateInputObjectSchema ]), update: z.union([ VendorUpdateInputObjectSchema, VendorUncheckedUpdateInputObjectSchema ]) }).strict();