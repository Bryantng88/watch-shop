import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSpecJobSelectObjectSchema as AcquisitionSpecJobSelectObjectSchema } from './objects/AcquisitionSpecJobSelect.schema';
import { AcquisitionSpecJobIncludeObjectSchema as AcquisitionSpecJobIncludeObjectSchema } from './objects/AcquisitionSpecJobInclude.schema';
import { AcquisitionSpecJobCreateInputObjectSchema as AcquisitionSpecJobCreateInputObjectSchema } from './objects/AcquisitionSpecJobCreateInput.schema';
import { AcquisitionSpecJobUncheckedCreateInputObjectSchema as AcquisitionSpecJobUncheckedCreateInputObjectSchema } from './objects/AcquisitionSpecJobUncheckedCreateInput.schema';

export const AcquisitionSpecJobCreateOneSchema: z.ZodType<Prisma.AcquisitionSpecJobCreateArgs> = z.object({ select: AcquisitionSpecJobSelectObjectSchema.optional(), include: AcquisitionSpecJobIncludeObjectSchema.optional(), data: z.union([AcquisitionSpecJobCreateInputObjectSchema, AcquisitionSpecJobUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.AcquisitionSpecJobCreateArgs>;

export const AcquisitionSpecJobCreateOneZodSchema = z.object({ select: AcquisitionSpecJobSelectObjectSchema.optional(), include: AcquisitionSpecJobIncludeObjectSchema.optional(), data: z.union([AcquisitionSpecJobCreateInputObjectSchema, AcquisitionSpecJobUncheckedCreateInputObjectSchema]) }).strict();