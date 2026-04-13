import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { acquisition_spec_jobWhereInputObjectSchema as acquisition_spec_jobWhereInputObjectSchema } from './objects/acquisition_spec_jobWhereInput.schema';

export const acquisition_spec_jobDeleteManySchema: z.ZodType<Prisma.acquisition_spec_jobDeleteManyArgs> = z.object({ where: acquisition_spec_jobWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.acquisition_spec_jobDeleteManyArgs>;

export const acquisition_spec_jobDeleteManyZodSchema = z.object({ where: acquisition_spec_jobWhereInputObjectSchema.optional() }).strict();