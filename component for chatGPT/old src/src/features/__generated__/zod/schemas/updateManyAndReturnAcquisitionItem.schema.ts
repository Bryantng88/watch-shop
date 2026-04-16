import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionItemSelectObjectSchema as AcquisitionItemSelectObjectSchema } from './objects/AcquisitionItemSelect.schema';
import { AcquisitionItemUpdateManyMutationInputObjectSchema as AcquisitionItemUpdateManyMutationInputObjectSchema } from './objects/AcquisitionItemUpdateManyMutationInput.schema';
import { AcquisitionItemWhereInputObjectSchema as AcquisitionItemWhereInputObjectSchema } from './objects/AcquisitionItemWhereInput.schema';

export const AcquisitionItemUpdateManyAndReturnSchema: z.ZodType<Prisma.AcquisitionItemUpdateManyAndReturnArgs> = z.object({ select: AcquisitionItemSelectObjectSchema.optional(), data: AcquisitionItemUpdateManyMutationInputObjectSchema, where: AcquisitionItemWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionItemUpdateManyAndReturnArgs>;

export const AcquisitionItemUpdateManyAndReturnZodSchema = z.object({ select: AcquisitionItemSelectObjectSchema.optional(), data: AcquisitionItemUpdateManyMutationInputObjectSchema, where: AcquisitionItemWhereInputObjectSchema.optional() }).strict();