import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  idempotencyKey: z.string().optional()
}).strict();
export const CarrierRequestWhereUniqueInputObjectSchema: z.ZodType<Prisma.CarrierRequestWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierRequestWhereUniqueInput>;
export const CarrierRequestWhereUniqueInputObjectZodSchema = makeSchema();
