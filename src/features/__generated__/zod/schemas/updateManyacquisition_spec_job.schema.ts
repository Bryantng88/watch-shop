import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { acquisition_spec_jobUpdateManyMutationInputObjectSchema as acquisition_spec_jobUpdateManyMutationInputObjectSchema } from './objects/acquisition_spec_jobUpdateManyMutationInput.schema';
import { acquisition_spec_jobWhereInputObjectSchema as acquisition_spec_jobWhereInputObjectSchema } from './objects/acquisition_spec_jobWhereInput.schema';

export const acquisition_spec_jobUpdateManySchema: z.ZodType<Prisma.acquisition_spec_jobUpdateManyArgs> = z.object({ data: acquisition_spec_jobUpdateManyMutationInputObjectSchema, where: acquisition_spec_jobWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.acquisition_spec_jobUpdateManyArgs>;

export const acquisition_spec_jobUpdateManyZodSchema = z.object({ data: acquisition_spec_jobUpdateManyMutationInputObjectSchema, where: acquisition_spec_jobWhereInputObjectSchema.optional() }).strict();