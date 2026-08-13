import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const ShipmentPackageWhereUniqueInputObjectSchema: z.ZodType<Prisma.ShipmentPackageWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentPackageWhereUniqueInput>;
export const ShipmentPackageWhereUniqueInputObjectZodSchema = makeSchema();
