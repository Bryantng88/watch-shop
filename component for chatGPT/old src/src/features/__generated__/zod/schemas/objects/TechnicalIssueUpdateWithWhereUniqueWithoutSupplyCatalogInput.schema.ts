import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateWithoutSupplyCatalogInputObjectSchema as TechnicalIssueUpdateWithoutSupplyCatalogInputObjectSchema } from './TechnicalIssueUpdateWithoutSupplyCatalogInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutSupplyCatalogInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutSupplyCatalogInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutSupplyCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TechnicalIssueUpdateWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutSupplyCatalogInputObjectSchema)])
}).strict();
export const TechnicalIssueUpdateWithWhereUniqueWithoutSupplyCatalogInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateWithWhereUniqueWithoutSupplyCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateWithWhereUniqueWithoutSupplyCatalogInput>;
export const TechnicalIssueUpdateWithWhereUniqueWithoutSupplyCatalogInputObjectZodSchema = makeSchema();
