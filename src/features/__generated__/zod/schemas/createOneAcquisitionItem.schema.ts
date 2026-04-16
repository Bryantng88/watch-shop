import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionItemSelectObjectSchema as AcquisitionItemSelectObjectSchema } from './objects/AcquisitionItemSelect.schema';
import { AcquisitionItemIncludeObjectSchema as AcquisitionItemIncludeObjectSchema } from './objects/AcquisitionItemInclude.schema';
import { AcquisitionItemCreateInputObjectSchema as AcquisitionItemCreateInputObjectSchema } from './objects/AcquisitionItemCreateInput.schema';
import { AcquisitionItemUncheckedCreateInputObjectSchema as AcquisitionItemUncheckedCreateInputObjectSchema } from './objects/AcquisitionItemUncheckedCreateInput.schema';

export const AcquisitionItemCreateOneSchema: z.ZodType<Prisma.AcquisitionItemCreateArgs> = z.object({ select: AcquisitionItemSelectObjectSchema.optional(), include: AcquisitionItemIncludeObjectSchema.optional(), data: z.union([AcquisitionItemCreateInputObjectSchema, AcquisitionItemUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.AcquisitionItemCreateArgs>;

export const AcquisitionItemCreateOneZodSchema = z.object({ select: AcquisitionItemSelectObjectSchema.optional(), include: AcquisitionItemIncludeObjectSchema.optional(), data: z.union([AcquisitionItemCreateInputObjectSchema, AcquisitionItemUncheckedCreateInputObjectSchema]) }).strict();