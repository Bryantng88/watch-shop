import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const ShipmentWhereUniqueInputObjectSchema: z.ZodType<Prisma.ShipmentWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentWhereUniqueInput>;
export const ShipmentWhereUniqueInputObjectZodSchema = makeSchema();
