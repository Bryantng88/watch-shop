import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionItemUpdateManyMutationInputObjectSchema as AcquisitionItemUpdateManyMutationInputObjectSchema } from './objects/AcquisitionItemUpdateManyMutationInput.schema';
import { AcquisitionItemWhereInputObjectSchema as AcquisitionItemWhereInputObjectSchema } from './objects/AcquisitionItemWhereInput.schema';

export const AcquisitionItemUpdateManySchema: z.ZodType<Prisma.AcquisitionItemUpdateManyArgs> = z.object({ data: AcquisitionItemUpdateManyMutationInputObjectSchema, where: AcquisitionItemWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionItemUpdateManyArgs>;

export const AcquisitionItemUpdateManyZodSchema = z.object({ data: AcquisitionItemUpdateManyMutationInputObjectSchema, where: AcquisitionItemWhereInputObjectSchema.optional() }).strict();