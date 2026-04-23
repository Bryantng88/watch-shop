import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSpecJobLogSelectObjectSchema as AcquisitionSpecJobLogSelectObjectSchema } from './objects/AcquisitionSpecJobLogSelect.schema';
import { AcquisitionSpecJobLogUpdateManyMutationInputObjectSchema as AcquisitionSpecJobLogUpdateManyMutationInputObjectSchema } from './objects/AcquisitionSpecJobLogUpdateManyMutationInput.schema';
import { AcquisitionSpecJobLogWhereInputObjectSchema as AcquisitionSpecJobLogWhereInputObjectSchema } from './objects/AcquisitionSpecJobLogWhereInput.schema';

export const AcquisitionSpecJobLogUpdateManyAndReturnSchema: z.ZodType<Prisma.AcquisitionSpecJobLogUpdateManyAndReturnArgs> = z.object({ select: AcquisitionSpecJobLogSelectObjectSchema.optional(), data: AcquisitionSpecJobLogUpdateManyMutationInputObjectSchema, where: AcquisitionSpecJobLogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogUpdateManyAndReturnArgs>;

export const AcquisitionSpecJobLogUpdateManyAndReturnZodSchema = z.object({ select: AcquisitionSpecJobLogSelectObjectSchema.optional(), data: AcquisitionSpecJobLogUpdateManyMutationInputObjectSchema, where: AcquisitionSpecJobLogWhereInputObjectSchema.optional() }).strict();