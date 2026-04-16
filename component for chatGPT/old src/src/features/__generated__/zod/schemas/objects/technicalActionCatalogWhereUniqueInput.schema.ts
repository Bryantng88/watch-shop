import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string().optional()
}).strict();
export const technicalActionCatalogWhereUniqueInputObjectSchema: z.ZodType<Prisma.technicalActionCatalogWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalActionCatalogWhereUniqueInput>;
export const technicalActionCatalogWhereUniqueInputObjectZodSchema = makeSchema();
