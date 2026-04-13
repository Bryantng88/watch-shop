import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  acquisition_item_id: z.string().optional()
}).strict();
export const acquisition_spec_jobWhereUniqueInputObjectSchema: z.ZodType<Prisma.acquisition_spec_jobWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.acquisition_spec_jobWhereUniqueInput>;
export const acquisition_spec_jobWhereUniqueInputObjectZodSchema = makeSchema();
