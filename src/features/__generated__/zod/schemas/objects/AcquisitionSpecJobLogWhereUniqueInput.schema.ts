import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const AcquisitionSpecJobLogWhereUniqueInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobLogWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogWhereUniqueInput>;
export const AcquisitionSpecJobLogWhereUniqueInputObjectZodSchema = makeSchema();
