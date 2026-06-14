import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalDetailCatalogCreateWithoutTaskActionInputObjectSchema as TechnicalDetailCatalogCreateWithoutTaskActionInputObjectSchema } from './TechnicalDetailCatalogCreateWithoutTaskActionInput.schema';
import { TechnicalDetailCatalogUncheckedCreateWithoutTaskActionInputObjectSchema as TechnicalDetailCatalogUncheckedCreateWithoutTaskActionInputObjectSchema } from './TechnicalDetailCatalogUncheckedCreateWithoutTaskActionInput.schema';
import { TechnicalDetailCatalogCreateOrConnectWithoutTaskActionInputObjectSchema as TechnicalDetailCatalogCreateOrConnectWithoutTaskActionInputObjectSchema } from './TechnicalDetailCatalogCreateOrConnectWithoutTaskActionInput.schema';
import { TechnicalDetailCatalogWhereUniqueInputObjectSchema as TechnicalDetailCatalogWhereUniqueInputObjectSchema } from './TechnicalDetailCatalogWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalDetailCatalogCreateWithoutTaskActionInputObjectSchema), z.lazy(() => TechnicalDetailCatalogUncheckedCreateWithoutTaskActionInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TechnicalDetailCatalogCreateOrConnectWithoutTaskActionInputObjectSchema).optional(),
  connect: z.lazy(() => TechnicalDetailCatalogWhereUniqueInputObjectSchema).optional()
}).strict();
export const TechnicalDetailCatalogCreateNestedOneWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogCreateNestedOneWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogCreateNestedOneWithoutTaskActionInput>;
export const TechnicalDetailCatalogCreateNestedOneWithoutTaskActionInputObjectZodSchema = makeSchema();
