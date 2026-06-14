import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalDetailCatalogCreateWithoutTaskActionInputObjectSchema as TechnicalDetailCatalogCreateWithoutTaskActionInputObjectSchema } from './TechnicalDetailCatalogCreateWithoutTaskActionInput.schema';
import { TechnicalDetailCatalogUncheckedCreateWithoutTaskActionInputObjectSchema as TechnicalDetailCatalogUncheckedCreateWithoutTaskActionInputObjectSchema } from './TechnicalDetailCatalogUncheckedCreateWithoutTaskActionInput.schema';
import { TechnicalDetailCatalogCreateOrConnectWithoutTaskActionInputObjectSchema as TechnicalDetailCatalogCreateOrConnectWithoutTaskActionInputObjectSchema } from './TechnicalDetailCatalogCreateOrConnectWithoutTaskActionInput.schema';
import { TechnicalDetailCatalogUpsertWithoutTaskActionInputObjectSchema as TechnicalDetailCatalogUpsertWithoutTaskActionInputObjectSchema } from './TechnicalDetailCatalogUpsertWithoutTaskActionInput.schema';
import { TechnicalDetailCatalogWhereInputObjectSchema as TechnicalDetailCatalogWhereInputObjectSchema } from './TechnicalDetailCatalogWhereInput.schema';
import { TechnicalDetailCatalogWhereUniqueInputObjectSchema as TechnicalDetailCatalogWhereUniqueInputObjectSchema } from './TechnicalDetailCatalogWhereUniqueInput.schema';
import { TechnicalDetailCatalogUpdateToOneWithWhereWithoutTaskActionInputObjectSchema as TechnicalDetailCatalogUpdateToOneWithWhereWithoutTaskActionInputObjectSchema } from './TechnicalDetailCatalogUpdateToOneWithWhereWithoutTaskActionInput.schema';
import { TechnicalDetailCatalogUpdateWithoutTaskActionInputObjectSchema as TechnicalDetailCatalogUpdateWithoutTaskActionInputObjectSchema } from './TechnicalDetailCatalogUpdateWithoutTaskActionInput.schema';
import { TechnicalDetailCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema as TechnicalDetailCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema } from './TechnicalDetailCatalogUncheckedUpdateWithoutTaskActionInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalDetailCatalogCreateWithoutTaskActionInputObjectSchema), z.lazy(() => TechnicalDetailCatalogUncheckedCreateWithoutTaskActionInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TechnicalDetailCatalogCreateOrConnectWithoutTaskActionInputObjectSchema).optional(),
  upsert: z.lazy(() => TechnicalDetailCatalogUpsertWithoutTaskActionInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => TechnicalDetailCatalogWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => TechnicalDetailCatalogWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => TechnicalDetailCatalogWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TechnicalDetailCatalogUpdateToOneWithWhereWithoutTaskActionInputObjectSchema), z.lazy(() => TechnicalDetailCatalogUpdateWithoutTaskActionInputObjectSchema), z.lazy(() => TechnicalDetailCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema)]).optional()
}).strict();
export const TechnicalDetailCatalogUpdateOneWithoutTaskActionNestedInputObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogUpdateOneWithoutTaskActionNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogUpdateOneWithoutTaskActionNestedInput>;
export const TechnicalDetailCatalogUpdateOneWithoutTaskActionNestedInputObjectZodSchema = makeSchema();
