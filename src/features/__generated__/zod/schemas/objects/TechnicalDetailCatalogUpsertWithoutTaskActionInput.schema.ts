import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalDetailCatalogUpdateWithoutTaskActionInputObjectSchema as TechnicalDetailCatalogUpdateWithoutTaskActionInputObjectSchema } from './TechnicalDetailCatalogUpdateWithoutTaskActionInput.schema';
import { TechnicalDetailCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema as TechnicalDetailCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema } from './TechnicalDetailCatalogUncheckedUpdateWithoutTaskActionInput.schema';
import { TechnicalDetailCatalogCreateWithoutTaskActionInputObjectSchema as TechnicalDetailCatalogCreateWithoutTaskActionInputObjectSchema } from './TechnicalDetailCatalogCreateWithoutTaskActionInput.schema';
import { TechnicalDetailCatalogUncheckedCreateWithoutTaskActionInputObjectSchema as TechnicalDetailCatalogUncheckedCreateWithoutTaskActionInputObjectSchema } from './TechnicalDetailCatalogUncheckedCreateWithoutTaskActionInput.schema';
import { TechnicalDetailCatalogWhereInputObjectSchema as TechnicalDetailCatalogWhereInputObjectSchema } from './TechnicalDetailCatalogWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TechnicalDetailCatalogUpdateWithoutTaskActionInputObjectSchema), z.lazy(() => TechnicalDetailCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema)]),
  create: z.union([z.lazy(() => TechnicalDetailCatalogCreateWithoutTaskActionInputObjectSchema), z.lazy(() => TechnicalDetailCatalogUncheckedCreateWithoutTaskActionInputObjectSchema)]),
  where: z.lazy(() => TechnicalDetailCatalogWhereInputObjectSchema).optional()
}).strict();
export const TechnicalDetailCatalogUpsertWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogUpsertWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogUpsertWithoutTaskActionInput>;
export const TechnicalDetailCatalogUpsertWithoutTaskActionInputObjectZodSchema = makeSchema();
