import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionItemSelectObjectSchema as AcquisitionItemSelectObjectSchema } from './objects/AcquisitionItemSelect.schema';
import { AcquisitionItemIncludeObjectSchema as AcquisitionItemIncludeObjectSchema } from './objects/AcquisitionItemInclude.schema';
import { AcquisitionItemUpdateInputObjectSchema as AcquisitionItemUpdateInputObjectSchema } from './objects/AcquisitionItemUpdateInput.schema';
import { AcquisitionItemUncheckedUpdateInputObjectSchema as AcquisitionItemUncheckedUpdateInputObjectSchema } from './objects/AcquisitionItemUncheckedUpdateInput.schema';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './objects/AcquisitionItemWhereUniqueInput.schema';

export const AcquisitionItemUpdateOneSchema: z.ZodType<Prisma.AcquisitionItemUpdateArgs> = z.object({ select: AcquisitionItemSelectObjectSchema.optional(), include: AcquisitionItemIncludeObjectSchema.optional(), data: z.union([AcquisitionItemUpdateInputObjectSchema, AcquisitionItemUncheckedUpdateInputObjectSchema]), where: AcquisitionItemWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.AcquisitionItemUpdateArgs>;

export const AcquisitionItemUpdateOneZodSchema = z.object({ select: AcquisitionItemSelectObjectSchema.optional(), include: AcquisitionItemIncludeObjectSchema.optional(), data: z.union([AcquisitionItemUpdateInputObjectSchema, AcquisitionItemUncheckedUpdateInputObjectSchema]), where: AcquisitionItemWhereUniqueInputObjectSchema }).strict();