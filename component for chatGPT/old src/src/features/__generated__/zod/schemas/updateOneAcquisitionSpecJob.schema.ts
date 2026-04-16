import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSpecJobSelectObjectSchema as AcquisitionSpecJobSelectObjectSchema } from './objects/AcquisitionSpecJobSelect.schema';
import { AcquisitionSpecJobIncludeObjectSchema as AcquisitionSpecJobIncludeObjectSchema } from './objects/AcquisitionSpecJobInclude.schema';
import { AcquisitionSpecJobUpdateInputObjectSchema as AcquisitionSpecJobUpdateInputObjectSchema } from './objects/AcquisitionSpecJobUpdateInput.schema';
import { AcquisitionSpecJobUncheckedUpdateInputObjectSchema as AcquisitionSpecJobUncheckedUpdateInputObjectSchema } from './objects/AcquisitionSpecJobUncheckedUpdateInput.schema';
import { AcquisitionSpecJobWhereUniqueInputObjectSchema as AcquisitionSpecJobWhereUniqueInputObjectSchema } from './objects/AcquisitionSpecJobWhereUniqueInput.schema';

export const AcquisitionSpecJobUpdateOneSchema: z.ZodType<Prisma.AcquisitionSpecJobUpdateArgs> = z.object({ select: AcquisitionSpecJobSelectObjectSchema.optional(), include: AcquisitionSpecJobIncludeObjectSchema.optional(), data: z.union([AcquisitionSpecJobUpdateInputObjectSchema, AcquisitionSpecJobUncheckedUpdateInputObjectSchema]), where: AcquisitionSpecJobWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.AcquisitionSpecJobUpdateArgs>;

export const AcquisitionSpecJobUpdateOneZodSchema = z.object({ select: AcquisitionSpecJobSelectObjectSchema.optional(), include: AcquisitionSpecJobIncludeObjectSchema.optional(), data: z.union([AcquisitionSpecJobUpdateInputObjectSchema, AcquisitionSpecJobUncheckedUpdateInputObjectSchema]), where: AcquisitionSpecJobWhereUniqueInputObjectSchema }).strict();