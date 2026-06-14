import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SupplyCatalogUpdateWithoutTaskActionInputObjectSchema as SupplyCatalogUpdateWithoutTaskActionInputObjectSchema } from './SupplyCatalogUpdateWithoutTaskActionInput.schema';
import { SupplyCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema as SupplyCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema } from './SupplyCatalogUncheckedUpdateWithoutTaskActionInput.schema';
import { SupplyCatalogCreateWithoutTaskActionInputObjectSchema as SupplyCatalogCreateWithoutTaskActionInputObjectSchema } from './SupplyCatalogCreateWithoutTaskActionInput.schema';
import { SupplyCatalogUncheckedCreateWithoutTaskActionInputObjectSchema as SupplyCatalogUncheckedCreateWithoutTaskActionInputObjectSchema } from './SupplyCatalogUncheckedCreateWithoutTaskActionInput.schema';
import { SupplyCatalogWhereInputObjectSchema as SupplyCatalogWhereInputObjectSchema } from './SupplyCatalogWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => SupplyCatalogUpdateWithoutTaskActionInputObjectSchema), z.lazy(() => SupplyCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema)]),
  create: z.union([z.lazy(() => SupplyCatalogCreateWithoutTaskActionInputObjectSchema), z.lazy(() => SupplyCatalogUncheckedCreateWithoutTaskActionInputObjectSchema)]),
  where: z.lazy(() => SupplyCatalogWhereInputObjectSchema).optional()
}).strict();
export const SupplyCatalogUpsertWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.SupplyCatalogUpsertWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.SupplyCatalogUpsertWithoutTaskActionInput>;
export const SupplyCatalogUpsertWithoutTaskActionInputObjectZodSchema = makeSchema();
