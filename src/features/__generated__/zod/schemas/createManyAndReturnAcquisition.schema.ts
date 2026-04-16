import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSelectObjectSchema as AcquisitionSelectObjectSchema } from './objects/AcquisitionSelect.schema';
import { AcquisitionCreateManyInputObjectSchema as AcquisitionCreateManyInputObjectSchema } from './objects/AcquisitionCreateManyInput.schema';

export const AcquisitionCreateManyAndReturnSchema: z.ZodType<Prisma.AcquisitionCreateManyAndReturnArgs> = z.object({ select: AcquisitionSelectObjectSchema.optional(), data: z.union([ AcquisitionCreateManyInputObjectSchema, z.array(AcquisitionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionCreateManyAndReturnArgs>;

export const AcquisitionCreateManyAndReturnZodSchema = z.object({ select: AcquisitionSelectObjectSchema.optional(), data: z.union([ AcquisitionCreateManyInputObjectSchema, z.array(AcquisitionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();