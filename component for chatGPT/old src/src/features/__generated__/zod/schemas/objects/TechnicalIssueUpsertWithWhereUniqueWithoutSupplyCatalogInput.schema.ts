import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateWithoutSupplyCatalogInputObjectSchema as TechnicalIssueUpdateWithoutSupplyCatalogInputObjectSchema } from './TechnicalIssueUpdateWithoutSupplyCatalogInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutSupplyCatalogInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutSupplyCatalogInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutSupplyCatalogInput.schema';
import { TechnicalIssueCreateWithoutSupplyCatalogInputObjectSchema as TechnicalIssueCreateWithoutSupplyCatalogInputObjectSchema } from './TechnicalIssueCreateWithoutSupplyCatalogInput.schema';
import { TechnicalIssueUncheckedCreateWithoutSupplyCatalogInputObjectSchema as TechnicalIssueUncheckedCreateWithoutSupplyCatalogInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutSupplyCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TechnicalIssueUpdateWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutSupplyCatalogInputObjectSchema)]),
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutSupplyCatalogInputObjectSchema)])
}).strict();
export const TechnicalIssueUpsertWithWhereUniqueWithoutSupplyCatalogInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpsertWithWhereUniqueWithoutSupplyCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpsertWithWhereUniqueWithoutSupplyCatalogInput>;
export const TechnicalIssueUpsertWithWhereUniqueWithoutSupplyCatalogInputObjectZodSchema = makeSchema();
