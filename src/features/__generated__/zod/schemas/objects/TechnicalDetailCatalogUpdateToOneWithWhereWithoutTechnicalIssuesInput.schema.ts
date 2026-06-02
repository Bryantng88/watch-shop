import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalDetailCatalogWhereInputObjectSchema as TechnicalDetailCatalogWhereInputObjectSchema } from './TechnicalDetailCatalogWhereInput.schema';
import { TechnicalDetailCatalogUpdateWithoutTechnicalIssuesInputObjectSchema as TechnicalDetailCatalogUpdateWithoutTechnicalIssuesInputObjectSchema } from './TechnicalDetailCatalogUpdateWithoutTechnicalIssuesInput.schema';
import { TechnicalDetailCatalogUncheckedUpdateWithoutTechnicalIssuesInputObjectSchema as TechnicalDetailCatalogUncheckedUpdateWithoutTechnicalIssuesInputObjectSchema } from './TechnicalDetailCatalogUncheckedUpdateWithoutTechnicalIssuesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalDetailCatalogWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TechnicalDetailCatalogUpdateWithoutTechnicalIssuesInputObjectSchema), z.lazy(() => TechnicalDetailCatalogUncheckedUpdateWithoutTechnicalIssuesInputObjectSchema)])
}).strict();
export const TechnicalDetailCatalogUpdateToOneWithWhereWithoutTechnicalIssuesInputObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogUpdateToOneWithWhereWithoutTechnicalIssuesInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogUpdateToOneWithWhereWithoutTechnicalIssuesInput>;
export const TechnicalDetailCatalogUpdateToOneWithWhereWithoutTechnicalIssuesInputObjectZodSchema = makeSchema();
