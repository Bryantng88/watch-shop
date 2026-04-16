import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SupplyCatalogUpdateWithoutTechnicalIssueInputObjectSchema as SupplyCatalogUpdateWithoutTechnicalIssueInputObjectSchema } from './SupplyCatalogUpdateWithoutTechnicalIssueInput.schema';
import { SupplyCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as SupplyCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './SupplyCatalogUncheckedUpdateWithoutTechnicalIssueInput.schema';
import { SupplyCatalogCreateWithoutTechnicalIssueInputObjectSchema as SupplyCatalogCreateWithoutTechnicalIssueInputObjectSchema } from './SupplyCatalogCreateWithoutTechnicalIssueInput.schema';
import { SupplyCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema as SupplyCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './SupplyCatalogUncheckedCreateWithoutTechnicalIssueInput.schema';
import { SupplyCatalogWhereInputObjectSchema as SupplyCatalogWhereInputObjectSchema } from './SupplyCatalogWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => SupplyCatalogUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => SupplyCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)]),
  create: z.union([z.lazy(() => SupplyCatalogCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => SupplyCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema)]),
  where: z.lazy(() => SupplyCatalogWhereInputObjectSchema).optional()
}).strict();
export const SupplyCatalogUpsertWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.SupplyCatalogUpsertWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.SupplyCatalogUpsertWithoutTechnicalIssueInput>;
export const SupplyCatalogUpsertWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
