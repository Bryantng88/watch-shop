import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { acquisition_spec_jobSelectObjectSchema as acquisition_spec_jobSelectObjectSchema } from './objects/acquisition_spec_jobSelect.schema';
import { acquisition_spec_jobWhereUniqueInputObjectSchema as acquisition_spec_jobWhereUniqueInputObjectSchema } from './objects/acquisition_spec_jobWhereUniqueInput.schema';

export const acquisition_spec_jobFindUniqueSchema: z.ZodType<Prisma.acquisition_spec_jobFindUniqueArgs> = z.object({ select: acquisition_spec_jobSelectObjectSchema.optional(),  where: acquisition_spec_jobWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.acquisition_spec_jobFindUniqueArgs>;

export const acquisition_spec_jobFindUniqueZodSchema = z.object({ select: acquisition_spec_jobSelectObjectSchema.optional(),  where: acquisition_spec_jobWhereUniqueInputObjectSchema }).strict();