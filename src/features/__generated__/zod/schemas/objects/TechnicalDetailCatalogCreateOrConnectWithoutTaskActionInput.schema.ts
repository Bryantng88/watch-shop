import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalDetailCatalogWhereUniqueInputObjectSchema as TechnicalDetailCatalogWhereUniqueInputObjectSchema } from './TechnicalDetailCatalogWhereUniqueInput.schema';
import { TechnicalDetailCatalogCreateWithoutTaskActionInputObjectSchema as TechnicalDetailCatalogCreateWithoutTaskActionInputObjectSchema } from './TechnicalDetailCatalogCreateWithoutTaskActionInput.schema';
import { TechnicalDetailCatalogUncheckedCreateWithoutTaskActionInputObjectSchema as TechnicalDetailCatalogUncheckedCreateWithoutTaskActionInputObjectSchema } from './TechnicalDetailCatalogUncheckedCreateWithoutTaskActionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalDetailCatalogWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TechnicalDetailCatalogCreateWithoutTaskActionInputObjectSchema), z.lazy(() => TechnicalDetailCatalogUncheckedCreateWithoutTaskActionInputObjectSchema)])
}).strict();
export const TechnicalDetailCatalogCreateOrConnectWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogCreateOrConnectWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogCreateOrConnectWithoutTaskActionInput>;
export const TechnicalDetailCatalogCreateOrConnectWithoutTaskActionInputObjectZodSchema = makeSchema();
