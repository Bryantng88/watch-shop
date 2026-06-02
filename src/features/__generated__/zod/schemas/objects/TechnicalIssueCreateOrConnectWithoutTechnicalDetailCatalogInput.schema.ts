import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueCreateWithoutTechnicalDetailCatalogInputObjectSchema as TechnicalIssueCreateWithoutTechnicalDetailCatalogInputObjectSchema } from './TechnicalIssueCreateWithoutTechnicalDetailCatalogInput.schema';
import { TechnicalIssueUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema as TechnicalIssueUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutTechnicalDetailCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema)])
}).strict();
export const TechnicalIssueCreateOrConnectWithoutTechnicalDetailCatalogInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutTechnicalDetailCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutTechnicalDetailCatalogInput>;
export const TechnicalIssueCreateOrConnectWithoutTechnicalDetailCatalogInputObjectZodSchema = makeSchema();
