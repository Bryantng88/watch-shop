import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateWithoutTechnicalDetailCatalogInputObjectSchema as TechnicalIssueUpdateWithoutTechnicalDetailCatalogInputObjectSchema } from './TechnicalIssueUpdateWithoutTechnicalDetailCatalogInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutTechnicalDetailCatalogInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutTechnicalDetailCatalogInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutTechnicalDetailCatalogInput.schema';
import { TechnicalIssueCreateWithoutTechnicalDetailCatalogInputObjectSchema as TechnicalIssueCreateWithoutTechnicalDetailCatalogInputObjectSchema } from './TechnicalIssueCreateWithoutTechnicalDetailCatalogInput.schema';
import { TechnicalIssueUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema as TechnicalIssueUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutTechnicalDetailCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TechnicalIssueUpdateWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutTechnicalDetailCatalogInputObjectSchema)]),
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema)])
}).strict();
export const TechnicalIssueUpsertWithWhereUniqueWithoutTechnicalDetailCatalogInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpsertWithWhereUniqueWithoutTechnicalDetailCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpsertWithWhereUniqueWithoutTechnicalDetailCatalogInput>;
export const TechnicalIssueUpsertWithWhereUniqueWithoutTechnicalDetailCatalogInputObjectZodSchema = makeSchema();
