import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSpecJobUpdateManyMutationInputObjectSchema as AcquisitionSpecJobUpdateManyMutationInputObjectSchema } from './objects/AcquisitionSpecJobUpdateManyMutationInput.schema';
import { AcquisitionSpecJobWhereInputObjectSchema as AcquisitionSpecJobWhereInputObjectSchema } from './objects/AcquisitionSpecJobWhereInput.schema';

export const AcquisitionSpecJobUpdateManySchema: z.ZodType<Prisma.AcquisitionSpecJobUpdateManyArgs> = z.object({ data: AcquisitionSpecJobUpdateManyMutationInputObjectSchema, where: AcquisitionSpecJobWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionSpecJobUpdateManyArgs>;

export const AcquisitionSpecJobUpdateManyZodSchema = z.object({ data: AcquisitionSpecJobUpdateManyMutationInputObjectSchema, where: AcquisitionSpecJobWhereInputObjectSchema.optional() }).strict();