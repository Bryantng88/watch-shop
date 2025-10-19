import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const AcquisitionWhereUniqueInputObjectSchema: z.ZodType<Prisma.AcquisitionWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionWhereUniqueInput>;
export const AcquisitionWhereUniqueInputObjectZodSchema = makeSchema();
