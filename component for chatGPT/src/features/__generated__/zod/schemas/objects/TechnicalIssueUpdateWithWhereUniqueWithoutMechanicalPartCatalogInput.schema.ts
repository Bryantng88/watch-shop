import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateWithoutMechanicalPartCatalogInputObjectSchema as TechnicalIssueUpdateWithoutMechanicalPartCatalogInputObjectSchema } from './TechnicalIssueUpdateWithoutMechanicalPartCatalogInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutMechanicalPartCatalogInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutMechanicalPartCatalogInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutMechanicalPartCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TechnicalIssueUpdateWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutMechanicalPartCatalogInputObjectSchema)])
}).strict();
export const TechnicalIssueUpdateWithWhereUniqueWithoutMechanicalPartCatalogInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateWithWhereUniqueWithoutMechanicalPartCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateWithWhereUniqueWithoutMechanicalPartCatalogInput>;
export const TechnicalIssueUpdateWithWhereUniqueWithoutMechanicalPartCatalogInputObjectZodSchema = makeSchema();
