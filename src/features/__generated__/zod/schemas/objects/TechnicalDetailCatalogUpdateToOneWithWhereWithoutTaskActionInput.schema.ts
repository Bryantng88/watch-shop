import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalDetailCatalogWhereInputObjectSchema as TechnicalDetailCatalogWhereInputObjectSchema } from './TechnicalDetailCatalogWhereInput.schema';
import { TechnicalDetailCatalogUpdateWithoutTaskActionInputObjectSchema as TechnicalDetailCatalogUpdateWithoutTaskActionInputObjectSchema } from './TechnicalDetailCatalogUpdateWithoutTaskActionInput.schema';
import { TechnicalDetailCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema as TechnicalDetailCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema } from './TechnicalDetailCatalogUncheckedUpdateWithoutTaskActionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalDetailCatalogWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TechnicalDetailCatalogUpdateWithoutTaskActionInputObjectSchema), z.lazy(() => TechnicalDetailCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema)])
}).strict();
export const TechnicalDetailCatalogUpdateToOneWithWhereWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogUpdateToOneWithWhereWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogUpdateToOneWithWhereWithoutTaskActionInput>;
export const TechnicalDetailCatalogUpdateToOneWithWhereWithoutTaskActionInputObjectZodSchema = makeSchema();
