import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionUpdateManyMutationInputObjectSchema as AcquisitionUpdateManyMutationInputObjectSchema } from './objects/AcquisitionUpdateManyMutationInput.schema';
import { AcquisitionWhereInputObjectSchema as AcquisitionWhereInputObjectSchema } from './objects/AcquisitionWhereInput.schema';

export const AcquisitionUpdateManySchema: z.ZodType<Prisma.AcquisitionUpdateManyArgs> = z.object({ data: AcquisitionUpdateManyMutationInputObjectSchema, where: AcquisitionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionUpdateManyArgs>;

export const AcquisitionUpdateManyZodSchema = z.object({ data: AcquisitionUpdateManyMutationInputObjectSchema, where: AcquisitionWhereInputObjectSchema.optional() }).strict();