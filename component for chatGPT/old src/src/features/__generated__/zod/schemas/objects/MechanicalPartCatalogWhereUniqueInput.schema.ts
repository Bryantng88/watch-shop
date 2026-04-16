import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string().optional()
}).strict();
export const MechanicalPartCatalogWhereUniqueInputObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.MechanicalPartCatalogWhereUniqueInput>;
export const MechanicalPartCatalogWhereUniqueInputObjectZodSchema = makeSchema();
