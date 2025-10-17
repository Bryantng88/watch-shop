import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSelectObjectSchema as AcquisitionSelectObjectSchema } from './objects/AcquisitionSelect.schema';
import { AcquisitionUpdateManyMutationInputObjectSchema as AcquisitionUpdateManyMutationInputObjectSchema } from './objects/AcquisitionUpdateManyMutationInput.schema';
import { AcquisitionWhereInputObjectSchema as AcquisitionWhereInputObjectSchema } from './objects/AcquisitionWhereInput.schema';

export const AcquisitionUpdateManyAndReturnSchema: z.ZodType<Prisma.AcquisitionUpdateManyAndReturnArgs> = z.object({ select: AcquisitionSelectObjectSchema.optional(), data: AcquisitionUpdateManyMutationInputObjectSchema, where: AcquisitionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionUpdateManyAndReturnArgs>;

export const AcquisitionUpdateManyAndReturnZodSchema = z.object({ select: AcquisitionSelectObjectSchema.optional(), data: AcquisitionUpdateManyMutationInputObjectSchema, where: AcquisitionWhereInputObjectSchema.optional() }).strict();