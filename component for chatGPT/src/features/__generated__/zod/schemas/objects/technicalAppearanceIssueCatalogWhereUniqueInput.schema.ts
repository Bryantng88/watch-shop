import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string().optional()
}).strict();
export const technicalAppearanceIssueCatalogWhereUniqueInputObjectSchema: z.ZodType<Prisma.technicalAppearanceIssueCatalogWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalAppearanceIssueCatalogWhereUniqueInput>;
export const technicalAppearanceIssueCatalogWhereUniqueInputObjectZodSchema = makeSchema();
