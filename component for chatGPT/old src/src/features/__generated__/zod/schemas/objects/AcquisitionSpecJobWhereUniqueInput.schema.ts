import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  acquisitionItemId: z.string().optional()
}).strict();
export const AcquisitionSpecJobWhereUniqueInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobWhereUniqueInput>;
export const AcquisitionSpecJobWhereUniqueInputObjectZodSchema = makeSchema();
