import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSpecJobLogSelectObjectSchema as AcquisitionSpecJobLogSelectObjectSchema } from './objects/AcquisitionSpecJobLogSelect.schema';
import { AcquisitionSpecJobLogIncludeObjectSchema as AcquisitionSpecJobLogIncludeObjectSchema } from './objects/AcquisitionSpecJobLogInclude.schema';
import { AcquisitionSpecJobLogWhereUniqueInputObjectSchema as AcquisitionSpecJobLogWhereUniqueInputObjectSchema } from './objects/AcquisitionSpecJobLogWhereUniqueInput.schema';
import { AcquisitionSpecJobLogCreateInputObjectSchema as AcquisitionSpecJobLogCreateInputObjectSchema } from './objects/AcquisitionSpecJobLogCreateInput.schema';
import { AcquisitionSpecJobLogUncheckedCreateInputObjectSchema as AcquisitionSpecJobLogUncheckedCreateInputObjectSchema } from './objects/AcquisitionSpecJobLogUncheckedCreateInput.schema';
import { AcquisitionSpecJobLogUpdateInputObjectSchema as AcquisitionSpecJobLogUpdateInputObjectSchema } from './objects/AcquisitionSpecJobLogUpdateInput.schema';
import { AcquisitionSpecJobLogUncheckedUpdateInputObjectSchema as AcquisitionSpecJobLogUncheckedUpdateInputObjectSchema } from './objects/AcquisitionSpecJobLogUncheckedUpdateInput.schema';

export const AcquisitionSpecJobLogUpsertOneSchema: z.ZodType<Prisma.AcquisitionSpecJobLogUpsertArgs> = z.object({ select: AcquisitionSpecJobLogSelectObjectSchema.optional(), include: AcquisitionSpecJobLogIncludeObjectSchema.optional(), where: AcquisitionSpecJobLogWhereUniqueInputObjectSchema, create: z.union([ AcquisitionSpecJobLogCreateInputObjectSchema, AcquisitionSpecJobLogUncheckedCreateInputObjectSchema ]), update: z.union([ AcquisitionSpecJobLogUpdateInputObjectSchema, AcquisitionSpecJobLogUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogUpsertArgs>;

export const AcquisitionSpecJobLogUpsertOneZodSchema = z.object({ select: AcquisitionSpecJobLogSelectObjectSchema.optional(), include: AcquisitionSpecJobLogIncludeObjectSchema.optional(), where: AcquisitionSpecJobLogWhereUniqueInputObjectSchema, create: z.union([ AcquisitionSpecJobLogCreateInputObjectSchema, AcquisitionSpecJobLogUncheckedCreateInputObjectSchema ]), update: z.union([ AcquisitionSpecJobLogUpdateInputObjectSchema, AcquisitionSpecJobLogUncheckedUpdateInputObjectSchema ]) }).strict();