import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateWithoutTechnicalDetailCatalogInputObjectSchema as TechnicalIssueUpdateWithoutTechnicalDetailCatalogInputObjectSchema } from './TechnicalIssueUpdateWithoutTechnicalDetailCatalogInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutTechnicalDetailCatalogInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutTechnicalDetailCatalogInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutTechnicalDetailCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TechnicalIssueUpdateWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutTechnicalDetailCatalogInputObjectSchema)])
}).strict();
export const TechnicalIssueUpdateWithWhereUniqueWithoutTechnicalDetailCatalogInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateWithWhereUniqueWithoutTechnicalDetailCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateWithWhereUniqueWithoutTechnicalDetailCatalogInput>;
export const TechnicalIssueUpdateWithWhereUniqueWithoutTechnicalDetailCatalogInputObjectZodSchema = makeSchema();
