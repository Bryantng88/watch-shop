import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { acquisition_spec_jobSelectObjectSchema as acquisition_spec_jobSelectObjectSchema } from './objects/acquisition_spec_jobSelect.schema';
import { acquisition_spec_jobUpdateInputObjectSchema as acquisition_spec_jobUpdateInputObjectSchema } from './objects/acquisition_spec_jobUpdateInput.schema';
import { acquisition_spec_jobUncheckedUpdateInputObjectSchema as acquisition_spec_jobUncheckedUpdateInputObjectSchema } from './objects/acquisition_spec_jobUncheckedUpdateInput.schema';
import { acquisition_spec_jobWhereUniqueInputObjectSchema as acquisition_spec_jobWhereUniqueInputObjectSchema } from './objects/acquisition_spec_jobWhereUniqueInput.schema';

export const acquisition_spec_jobUpdateOneSchema: z.ZodType<Prisma.acquisition_spec_jobUpdateArgs> = z.object({ select: acquisition_spec_jobSelectObjectSchema.optional(),  data: z.union([acquisition_spec_jobUpdateInputObjectSchema, acquisition_spec_jobUncheckedUpdateInputObjectSchema]), where: acquisition_spec_jobWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.acquisition_spec_jobUpdateArgs>;

export const acquisition_spec_jobUpdateOneZodSchema = z.object({ select: acquisition_spec_jobSelectObjectSchema.optional(),  data: z.union([acquisition_spec_jobUpdateInputObjectSchema, acquisition_spec_jobUncheckedUpdateInputObjectSchema]), where: acquisition_spec_jobWhereUniqueInputObjectSchema }).strict();