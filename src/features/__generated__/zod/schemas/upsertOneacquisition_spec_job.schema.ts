import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { acquisition_spec_jobSelectObjectSchema as acquisition_spec_jobSelectObjectSchema } from './objects/acquisition_spec_jobSelect.schema';
import { acquisition_spec_jobWhereUniqueInputObjectSchema as acquisition_spec_jobWhereUniqueInputObjectSchema } from './objects/acquisition_spec_jobWhereUniqueInput.schema';
import { acquisition_spec_jobCreateInputObjectSchema as acquisition_spec_jobCreateInputObjectSchema } from './objects/acquisition_spec_jobCreateInput.schema';
import { acquisition_spec_jobUncheckedCreateInputObjectSchema as acquisition_spec_jobUncheckedCreateInputObjectSchema } from './objects/acquisition_spec_jobUncheckedCreateInput.schema';
import { acquisition_spec_jobUpdateInputObjectSchema as acquisition_spec_jobUpdateInputObjectSchema } from './objects/acquisition_spec_jobUpdateInput.schema';
import { acquisition_spec_jobUncheckedUpdateInputObjectSchema as acquisition_spec_jobUncheckedUpdateInputObjectSchema } from './objects/acquisition_spec_jobUncheckedUpdateInput.schema';

export const acquisition_spec_jobUpsertOneSchema: z.ZodType<Prisma.acquisition_spec_jobUpsertArgs> = z.object({ select: acquisition_spec_jobSelectObjectSchema.optional(),  where: acquisition_spec_jobWhereUniqueInputObjectSchema, create: z.union([ acquisition_spec_jobCreateInputObjectSchema, acquisition_spec_jobUncheckedCreateInputObjectSchema ]), update: z.union([ acquisition_spec_jobUpdateInputObjectSchema, acquisition_spec_jobUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.acquisition_spec_jobUpsertArgs>;

export const acquisition_spec_jobUpsertOneZodSchema = z.object({ select: acquisition_spec_jobSelectObjectSchema.optional(),  where: acquisition_spec_jobWhereUniqueInputObjectSchema, create: z.union([ acquisition_spec_jobCreateInputObjectSchema, acquisition_spec_jobUncheckedCreateInputObjectSchema ]), update: z.union([ acquisition_spec_jobUpdateInputObjectSchema, acquisition_spec_jobUncheckedUpdateInputObjectSchema ]) }).strict();