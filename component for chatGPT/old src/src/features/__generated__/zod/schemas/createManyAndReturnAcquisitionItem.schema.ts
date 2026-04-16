import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionItemSelectObjectSchema as AcquisitionItemSelectObjectSchema } from './objects/AcquisitionItemSelect.schema';
import { AcquisitionItemCreateManyInputObjectSchema as AcquisitionItemCreateManyInputObjectSchema } from './objects/AcquisitionItemCreateManyInput.schema';

export const AcquisitionItemCreateManyAndReturnSchema: z.ZodType<Prisma.AcquisitionItemCreateManyAndReturnArgs> = z.object({ select: AcquisitionItemSelectObjectSchema.optional(), data: z.union([ AcquisitionItemCreateManyInputObjectSchema, z.array(AcquisitionItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionItemCreateManyAndReturnArgs>;

export const AcquisitionItemCreateManyAndReturnZodSchema = z.object({ select: AcquisitionItemSelectObjectSchema.optional(), data: z.union([ AcquisitionItemCreateManyInputObjectSchema, z.array(AcquisitionItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();