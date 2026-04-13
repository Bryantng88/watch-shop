import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { acquisition_spec_jobSelectObjectSchema as acquisition_spec_jobSelectObjectSchema } from './objects/acquisition_spec_jobSelect.schema';
import { acquisition_spec_jobUpdateManyMutationInputObjectSchema as acquisition_spec_jobUpdateManyMutationInputObjectSchema } from './objects/acquisition_spec_jobUpdateManyMutationInput.schema';
import { acquisition_spec_jobWhereInputObjectSchema as acquisition_spec_jobWhereInputObjectSchema } from './objects/acquisition_spec_jobWhereInput.schema';

export const acquisition_spec_jobUpdateManyAndReturnSchema: z.ZodType<Prisma.acquisition_spec_jobUpdateManyAndReturnArgs> = z.object({ select: acquisition_spec_jobSelectObjectSchema.optional(), data: acquisition_spec_jobUpdateManyMutationInputObjectSchema, where: acquisition_spec_jobWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.acquisition_spec_jobUpdateManyAndReturnArgs>;

export const acquisition_spec_jobUpdateManyAndReturnZodSchema = z.object({ select: acquisition_spec_jobSelectObjectSchema.optional(), data: acquisition_spec_jobUpdateManyMutationInputObjectSchema, where: acquisition_spec_jobWhereInputObjectSchema.optional() }).strict();