import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalDetailCatalogWhereUniqueInputObjectSchema as TechnicalDetailCatalogWhereUniqueInputObjectSchema } from './TechnicalDetailCatalogWhereUniqueInput.schema';
import { TechnicalDetailCatalogCreateWithoutTechnicalIssuesInputObjectSchema as TechnicalDetailCatalogCreateWithoutTechnicalIssuesInputObjectSchema } from './TechnicalDetailCatalogCreateWithoutTechnicalIssuesInput.schema';
import { TechnicalDetailCatalogUncheckedCreateWithoutTechnicalIssuesInputObjectSchema as TechnicalDetailCatalogUncheckedCreateWithoutTechnicalIssuesInputObjectSchema } from './TechnicalDetailCatalogUncheckedCreateWithoutTechnicalIssuesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalDetailCatalogWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TechnicalDetailCatalogCreateWithoutTechnicalIssuesInputObjectSchema), z.lazy(() => TechnicalDetailCatalogUncheckedCreateWithoutTechnicalIssuesInputObjectSchema)])
}).strict();
export const TechnicalDetailCatalogCreateOrConnectWithoutTechnicalIssuesInputObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogCreateOrConnectWithoutTechnicalIssuesInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogCreateOrConnectWithoutTechnicalIssuesInput>;
export const TechnicalDetailCatalogCreateOrConnectWithoutTechnicalIssuesInputObjectZodSchema = makeSchema();
