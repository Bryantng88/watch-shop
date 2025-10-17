import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const AcquisitionItemWhereUniqueInputObjectSchema: z.ZodType<Prisma.AcquisitionItemWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemWhereUniqueInput>;
export const AcquisitionItemWhereUniqueInputObjectZodSchema = makeSchema();
