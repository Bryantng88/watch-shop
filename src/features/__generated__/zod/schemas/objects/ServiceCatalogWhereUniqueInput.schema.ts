import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string().optional()
}).strict();
export const ServiceCatalogWhereUniqueInputObjectSchema: z.ZodType<Prisma.ServiceCatalogWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogWhereUniqueInput>;
export const ServiceCatalogWhereUniqueInputObjectZodSchema = makeSchema();
