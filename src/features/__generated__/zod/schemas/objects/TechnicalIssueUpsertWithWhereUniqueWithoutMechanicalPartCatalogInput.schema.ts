import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateWithoutMechanicalPartCatalogInputObjectSchema as TechnicalIssueUpdateWithoutMechanicalPartCatalogInputObjectSchema } from './TechnicalIssueUpdateWithoutMechanicalPartCatalogInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutMechanicalPartCatalogInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutMechanicalPartCatalogInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutMechanicalPartCatalogInput.schema';
import { TechnicalIssueCreateWithoutMechanicalPartCatalogInputObjectSchema as TechnicalIssueCreateWithoutMechanicalPartCatalogInputObjectSchema } from './TechnicalIssueCreateWithoutMechanicalPartCatalogInput.schema';
import { TechnicalIssueUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema as TechnicalIssueUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutMechanicalPartCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TechnicalIssueUpdateWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutMechanicalPartCatalogInputObjectSchema)]),
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema)])
}).strict();
export const TechnicalIssueUpsertWithWhereUniqueWithoutMechanicalPartCatalogInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpsertWithWhereUniqueWithoutMechanicalPartCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpsertWithWhereUniqueWithoutMechanicalPartCatalogInput>;
export const TechnicalIssueUpsertWithWhereUniqueWithoutMechanicalPartCatalogInputObjectZodSchema = makeSchema();
