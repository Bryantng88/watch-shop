import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSelectObjectSchema as AcquisitionSelectObjectSchema } from './objects/AcquisitionSelect.schema';
import { AcquisitionIncludeObjectSchema as AcquisitionIncludeObjectSchema } from './objects/AcquisitionInclude.schema';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './objects/AcquisitionWhereUniqueInput.schema';
import { AcquisitionCreateInputObjectSchema as AcquisitionCreateInputObjectSchema } from './objects/AcquisitionCreateInput.schema';
import { AcquisitionUncheckedCreateInputObjectSchema as AcquisitionUncheckedCreateInputObjectSchema } from './objects/AcquisitionUncheckedCreateInput.schema';
import { AcquisitionUpdateInputObjectSchema as AcquisitionUpdateInputObjectSchema } from './objects/AcquisitionUpdateInput.schema';
import { AcquisitionUncheckedUpdateInputObjectSchema as AcquisitionUncheckedUpdateInputObjectSchema } from './objects/AcquisitionUncheckedUpdateInput.schema';

export const AcquisitionUpsertOneSchema: z.ZodType<Prisma.AcquisitionUpsertArgs> = z.object({ select: AcquisitionSelectObjectSchema.optional(), include: AcquisitionIncludeObjectSchema.optional(), where: AcquisitionWhereUniqueInputObjectSchema, create: z.union([ AcquisitionCreateInputObjectSchema, AcquisitionUncheckedCreateInputObjectSchema ]), update: z.union([ AcquisitionUpdateInputObjectSchema, AcquisitionUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.AcquisitionUpsertArgs>;

export const AcquisitionUpsertOneZodSchema = z.object({ select: AcquisitionSelectObjectSchema.optional(), include: AcquisitionIncludeObjectSchema.optional(), where: AcquisitionWhereUniqueInputObjectSchema, create: z.union([ AcquisitionCreateInputObjectSchema, AcquisitionUncheckedCreateInputObjectSchema ]), update: z.union([ AcquisitionUpdateInputObjectSchema, AcquisitionUncheckedUpdateInputObjectSchema ]) }).strict();