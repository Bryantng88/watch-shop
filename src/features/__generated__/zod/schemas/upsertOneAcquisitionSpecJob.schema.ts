import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSpecJobSelectObjectSchema as AcquisitionSpecJobSelectObjectSchema } from './objects/AcquisitionSpecJobSelect.schema';
import { AcquisitionSpecJobIncludeObjectSchema as AcquisitionSpecJobIncludeObjectSchema } from './objects/AcquisitionSpecJobInclude.schema';
import { AcquisitionSpecJobWhereUniqueInputObjectSchema as AcquisitionSpecJobWhereUniqueInputObjectSchema } from './objects/AcquisitionSpecJobWhereUniqueInput.schema';
import { AcquisitionSpecJobCreateInputObjectSchema as AcquisitionSpecJobCreateInputObjectSchema } from './objects/AcquisitionSpecJobCreateInput.schema';
import { AcquisitionSpecJobUncheckedCreateInputObjectSchema as AcquisitionSpecJobUncheckedCreateInputObjectSchema } from './objects/AcquisitionSpecJobUncheckedCreateInput.schema';
import { AcquisitionSpecJobUpdateInputObjectSchema as AcquisitionSpecJobUpdateInputObjectSchema } from './objects/AcquisitionSpecJobUpdateInput.schema';
import { AcquisitionSpecJobUncheckedUpdateInputObjectSchema as AcquisitionSpecJobUncheckedUpdateInputObjectSchema } from './objects/AcquisitionSpecJobUncheckedUpdateInput.schema';

export const AcquisitionSpecJobUpsertOneSchema: z.ZodType<Prisma.AcquisitionSpecJobUpsertArgs> = z.object({ select: AcquisitionSpecJobSelectObjectSchema.optional(), include: AcquisitionSpecJobIncludeObjectSchema.optional(), where: AcquisitionSpecJobWhereUniqueInputObjectSchema, create: z.union([ AcquisitionSpecJobCreateInputObjectSchema, AcquisitionSpecJobUncheckedCreateInputObjectSchema ]), update: z.union([ AcquisitionSpecJobUpdateInputObjectSchema, AcquisitionSpecJobUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.AcquisitionSpecJobUpsertArgs>;

export const AcquisitionSpecJobUpsertOneZodSchema = z.object({ select: AcquisitionSpecJobSelectObjectSchema.optional(), include: AcquisitionSpecJobIncludeObjectSchema.optional(), where: AcquisitionSpecJobWhereUniqueInputObjectSchema, create: z.union([ AcquisitionSpecJobCreateInputObjectSchema, AcquisitionSpecJobUncheckedCreateInputObjectSchema ]), update: z.union([ AcquisitionSpecJobUpdateInputObjectSchema, AcquisitionSpecJobUncheckedUpdateInputObjectSchema ]) }).strict();