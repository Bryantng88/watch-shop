import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSpecJobLogUpdateManyMutationInputObjectSchema as AcquisitionSpecJobLogUpdateManyMutationInputObjectSchema } from './objects/AcquisitionSpecJobLogUpdateManyMutationInput.schema';
import { AcquisitionSpecJobLogWhereInputObjectSchema as AcquisitionSpecJobLogWhereInputObjectSchema } from './objects/AcquisitionSpecJobLogWhereInput.schema';

export const AcquisitionSpecJobLogUpdateManySchema: z.ZodType<Prisma.AcquisitionSpecJobLogUpdateManyArgs> = z.object({ data: AcquisitionSpecJobLogUpdateManyMutationInputObjectSchema, where: AcquisitionSpecJobLogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogUpdateManyArgs>;

export const AcquisitionSpecJobLogUpdateManyZodSchema = z.object({ data: AcquisitionSpecJobLogUpdateManyMutationInputObjectSchema, where: AcquisitionSpecJobLogWhereInputObjectSchema.optional() }).strict();