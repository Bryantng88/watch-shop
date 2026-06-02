import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalDetailCatalogUpdateWithoutTechnicalIssuesInputObjectSchema as TechnicalDetailCatalogUpdateWithoutTechnicalIssuesInputObjectSchema } from './TechnicalDetailCatalogUpdateWithoutTechnicalIssuesInput.schema';
import { TechnicalDetailCatalogUncheckedUpdateWithoutTechnicalIssuesInputObjectSchema as TechnicalDetailCatalogUncheckedUpdateWithoutTechnicalIssuesInputObjectSchema } from './TechnicalDetailCatalogUncheckedUpdateWithoutTechnicalIssuesInput.schema';
import { TechnicalDetailCatalogCreateWithoutTechnicalIssuesInputObjectSchema as TechnicalDetailCatalogCreateWithoutTechnicalIssuesInputObjectSchema } from './TechnicalDetailCatalogCreateWithoutTechnicalIssuesInput.schema';
import { TechnicalDetailCatalogUncheckedCreateWithoutTechnicalIssuesInputObjectSchema as TechnicalDetailCatalogUncheckedCreateWithoutTechnicalIssuesInputObjectSchema } from './TechnicalDetailCatalogUncheckedCreateWithoutTechnicalIssuesInput.schema';
import { TechnicalDetailCatalogWhereInputObjectSchema as TechnicalDetailCatalogWhereInputObjectSchema } from './TechnicalDetailCatalogWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TechnicalDetailCatalogUpdateWithoutTechnicalIssuesInputObjectSchema), z.lazy(() => TechnicalDetailCatalogUncheckedUpdateWithoutTechnicalIssuesInputObjectSchema)]),
  create: z.union([z.lazy(() => TechnicalDetailCatalogCreateWithoutTechnicalIssuesInputObjectSchema), z.lazy(() => TechnicalDetailCatalogUncheckedCreateWithoutTechnicalIssuesInputObjectSchema)]),
  where: z.lazy(() => TechnicalDetailCatalogWhereInputObjectSchema).optional()
}).strict();
export const TechnicalDetailCatalogUpsertWithoutTechnicalIssuesInputObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogUpsertWithoutTechnicalIssuesInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogUpsertWithoutTechnicalIssuesInput>;
export const TechnicalDetailCatalogUpsertWithoutTechnicalIssuesInputObjectZodSchema = makeSchema();
