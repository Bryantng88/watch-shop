import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSpecJobSelectObjectSchema as AcquisitionSpecJobSelectObjectSchema } from './objects/AcquisitionSpecJobSelect.schema';
import { AcquisitionSpecJobUpdateManyMutationInputObjectSchema as AcquisitionSpecJobUpdateManyMutationInputObjectSchema } from './objects/AcquisitionSpecJobUpdateManyMutationInput.schema';
import { AcquisitionSpecJobWhereInputObjectSchema as AcquisitionSpecJobWhereInputObjectSchema } from './objects/AcquisitionSpecJobWhereInput.schema';

export const AcquisitionSpecJobUpdateManyAndReturnSchema: z.ZodType<Prisma.AcquisitionSpecJobUpdateManyAndReturnArgs> = z.object({ select: AcquisitionSpecJobSelectObjectSchema.optional(), data: AcquisitionSpecJobUpdateManyMutationInputObjectSchema, where: AcquisitionSpecJobWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionSpecJobUpdateManyAndReturnArgs>;

export const AcquisitionSpecJobUpdateManyAndReturnZodSchema = z.object({ select: AcquisitionSpecJobSelectObjectSchema.optional(), data: AcquisitionSpecJobUpdateManyMutationInputObjectSchema, where: AcquisitionSpecJobWhereInputObjectSchema.optional() }).strict();