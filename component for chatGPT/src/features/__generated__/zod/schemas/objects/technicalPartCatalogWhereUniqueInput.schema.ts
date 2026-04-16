import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string().optional()
}).strict();
export const technicalPartCatalogWhereUniqueInputObjectSchema: z.ZodType<Prisma.technicalPartCatalogWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalPartCatalogWhereUniqueInput>;
export const technicalPartCatalogWhereUniqueInputObjectZodSchema = makeSchema();
