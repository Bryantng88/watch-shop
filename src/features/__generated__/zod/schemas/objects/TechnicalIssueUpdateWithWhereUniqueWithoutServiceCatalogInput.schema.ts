import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateWithoutServiceCatalogInputObjectSchema as TechnicalIssueUpdateWithoutServiceCatalogInputObjectSchema } from './TechnicalIssueUpdateWithoutServiceCatalogInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutServiceCatalogInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutServiceCatalogInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutServiceCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TechnicalIssueUpdateWithoutServiceCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutServiceCatalogInputObjectSchema)])
}).strict();
export const TechnicalIssueUpdateWithWhereUniqueWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateWithWhereUniqueWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateWithWhereUniqueWithoutServiceCatalogInput>;
export const TechnicalIssueUpdateWithWhereUniqueWithoutServiceCatalogInputObjectZodSchema = makeSchema();
