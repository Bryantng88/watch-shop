import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionItemSelectObjectSchema as AcquisitionItemSelectObjectSchema } from './objects/AcquisitionItemSelect.schema';
import { AcquisitionItemIncludeObjectSchema as AcquisitionItemIncludeObjectSchema } from './objects/AcquisitionItemInclude.schema';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './objects/AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemCreateInputObjectSchema as AcquisitionItemCreateInputObjectSchema } from './objects/AcquisitionItemCreateInput.schema';
import { AcquisitionItemUncheckedCreateInputObjectSchema as AcquisitionItemUncheckedCreateInputObjectSchema } from './objects/AcquisitionItemUncheckedCreateInput.schema';
import { AcquisitionItemUpdateInputObjectSchema as AcquisitionItemUpdateInputObjectSchema } from './objects/AcquisitionItemUpdateInput.schema';
import { AcquisitionItemUncheckedUpdateInputObjectSchema as AcquisitionItemUncheckedUpdateInputObjectSchema } from './objects/AcquisitionItemUncheckedUpdateInput.schema';

export const AcquisitionItemUpsertOneSchema: z.ZodType<Prisma.AcquisitionItemUpsertArgs> = z.object({ select: AcquisitionItemSelectObjectSchema.optional(), include: AcquisitionItemIncludeObjectSchema.optional(), where: AcquisitionItemWhereUniqueInputObjectSchema, create: z.union([ AcquisitionItemCreateInputObjectSchema, AcquisitionItemUncheckedCreateInputObjectSchema ]), update: z.union([ AcquisitionItemUpdateInputObjectSchema, AcquisitionItemUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.AcquisitionItemUpsertArgs>;

export const AcquisitionItemUpsertOneZodSchema = z.object({ select: AcquisitionItemSelectObjectSchema.optional(), include: AcquisitionItemIncludeObjectSchema.optional(), where: AcquisitionItemWhereUniqueInputObjectSchema, create: z.union([ AcquisitionItemCreateInputObjectSchema, AcquisitionItemUncheckedCreateInputObjectSchema ]), update: z.union([ AcquisitionItemUpdateInputObjectSchema, AcquisitionItemUncheckedUpdateInputObjectSchema ]) }).strict();