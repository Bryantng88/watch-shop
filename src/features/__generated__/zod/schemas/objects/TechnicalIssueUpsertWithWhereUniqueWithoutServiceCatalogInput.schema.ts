import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateWithoutServiceCatalogInputObjectSchema as TechnicalIssueUpdateWithoutServiceCatalogInputObjectSchema } from './TechnicalIssueUpdateWithoutServiceCatalogInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutServiceCatalogInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutServiceCatalogInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutServiceCatalogInput.schema';
import { TechnicalIssueCreateWithoutServiceCatalogInputObjectSchema as TechnicalIssueCreateWithoutServiceCatalogInputObjectSchema } from './TechnicalIssueCreateWithoutServiceCatalogInput.schema';
import { TechnicalIssueUncheckedCreateWithoutServiceCatalogInputObjectSchema as TechnicalIssueUncheckedCreateWithoutServiceCatalogInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutServiceCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TechnicalIssueUpdateWithoutServiceCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutServiceCatalogInputObjectSchema)]),
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutServiceCatalogInputObjectSchema)])
}).strict();
export const TechnicalIssueUpsertWithWhereUniqueWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpsertWithWhereUniqueWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpsertWithWhereUniqueWithoutServiceCatalogInput>;
export const TechnicalIssueUpsertWithWhereUniqueWithoutServiceCatalogInputObjectZodSchema = makeSchema();
