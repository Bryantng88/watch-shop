import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SupplyCatalogWhereInputObjectSchema as SupplyCatalogWhereInputObjectSchema } from './SupplyCatalogWhereInput.schema';
import { SupplyCatalogUpdateWithoutTechnicalIssueInputObjectSchema as SupplyCatalogUpdateWithoutTechnicalIssueInputObjectSchema } from './SupplyCatalogUpdateWithoutTechnicalIssueInput.schema';
import { SupplyCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as SupplyCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './SupplyCatalogUncheckedUpdateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SupplyCatalogWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => SupplyCatalogUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => SupplyCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const SupplyCatalogUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.SupplyCatalogUpdateToOneWithWhereWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.SupplyCatalogUpdateToOneWithWhereWithoutTechnicalIssueInput>;
export const SupplyCatalogUpdateToOneWithWhereWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
