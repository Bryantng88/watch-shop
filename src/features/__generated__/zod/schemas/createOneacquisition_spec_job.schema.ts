import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { acquisition_spec_jobSelectObjectSchema as acquisition_spec_jobSelectObjectSchema } from './objects/acquisition_spec_jobSelect.schema';
import { acquisition_spec_jobCreateInputObjectSchema as acquisition_spec_jobCreateInputObjectSchema } from './objects/acquisition_spec_jobCreateInput.schema';
import { acquisition_spec_jobUncheckedCreateInputObjectSchema as acquisition_spec_jobUncheckedCreateInputObjectSchema } from './objects/acquisition_spec_jobUncheckedCreateInput.schema';

export const acquisition_spec_jobCreateOneSchema: z.ZodType<Prisma.acquisition_spec_jobCreateArgs> = z.object({ select: acquisition_spec_jobSelectObjectSchema.optional(),  data: z.union([acquisition_spec_jobCreateInputObjectSchema, acquisition_spec_jobUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.acquisition_spec_jobCreateArgs>;

export const acquisition_spec_jobCreateOneZodSchema = z.object({ select: acquisition_spec_jobSelectObjectSchema.optional(),  data: z.union([acquisition_spec_jobCreateInputObjectSchema, acquisition_spec_jobUncheckedCreateInputObjectSchema]) }).strict();