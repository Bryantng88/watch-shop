import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionItemSelectObjectSchema as AcquisitionItemSelectObjectSchema } from './objects/AcquisitionItemSelect.schema';
import { AcquisitionItemIncludeObjectSchema as AcquisitionItemIncludeObjectSchema } from './objects/AcquisitionItemInclude.schema';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './objects/AcquisitionItemWhereUniqueInput.schema';

export const AcquisitionItemFindUniqueOrThrowSchema: z.ZodType<Prisma.AcquisitionItemFindUniqueOrThrowArgs> = z.object({ select: AcquisitionItemSelectObjectSchema.optional(), include: AcquisitionItemIncludeObjectSchema.optional(), where: AcquisitionItemWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.AcquisitionItemFindUniqueOrThrowArgs>;

export const AcquisitionItemFindUniqueOrThrowZodSchema = z.object({ select: AcquisitionItemSelectObjectSchema.optional(), include: AcquisitionItemIncludeObjectSchema.optional(), where: AcquisitionItemWhereUniqueInputObjectSchema }).strict();