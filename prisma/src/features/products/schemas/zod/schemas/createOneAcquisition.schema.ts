import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSelectObjectSchema as AcquisitionSelectObjectSchema } from './objects/AcquisitionSelect.schema';
import { AcquisitionIncludeObjectSchema as AcquisitionIncludeObjectSchema } from './objects/AcquisitionInclude.schema';
import { AcquisitionCreateInputObjectSchema as AcquisitionCreateInputObjectSchema } from './objects/AcquisitionCreateInput.schema';
import { AcquisitionUncheckedCreateInputObjectSchema as AcquisitionUncheckedCreateInputObjectSchema } from './objects/AcquisitionUncheckedCreateInput.schema';

export const AcquisitionCreateOneSchema: z.ZodType<Prisma.AcquisitionCreateArgs> = z.object({ select: AcquisitionSelectObjectSchema.optional(), include: AcquisitionIncludeObjectSchema.optional(), data: z.union([AcquisitionCreateInputObjectSchema, AcquisitionUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.AcquisitionCreateArgs>;

export const AcquisitionCreateOneZodSchema = z.object({ select: AcquisitionSelectObjectSchema.optional(), include: AcquisitionIncludeObjectSchema.optional(), data: z.union([AcquisitionCreateInputObjectSchema, AcquisitionUncheckedCreateInputObjectSchema]) }).strict();