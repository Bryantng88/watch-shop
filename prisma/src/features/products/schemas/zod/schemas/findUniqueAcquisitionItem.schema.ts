import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionItemSelectObjectSchema as AcquisitionItemSelectObjectSchema } from './objects/AcquisitionItemSelect.schema';
import { AcquisitionItemIncludeObjectSchema as AcquisitionItemIncludeObjectSchema } from './objects/AcquisitionItemInclude.schema';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './objects/AcquisitionItemWhereUniqueInput.schema';

export const AcquisitionItemFindUniqueSchema: z.ZodType<Prisma.AcquisitionItemFindUniqueArgs> = z.object({ select: AcquisitionItemSelectObjectSchema.optional(), include: AcquisitionItemIncludeObjectSchema.optional(), where: AcquisitionItemWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.AcquisitionItemFindUniqueArgs>;

export const AcquisitionItemFindUniqueZodSchema = z.object({ select: AcquisitionItemSelectObjectSchema.optional(), include: AcquisitionItemIncludeObjectSchema.optional(), where: AcquisitionItemWhereUniqueInputObjectSchema }).strict();