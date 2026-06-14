import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SupplyCatalogWhereInputObjectSchema as SupplyCatalogWhereInputObjectSchema } from './SupplyCatalogWhereInput.schema';
import { SupplyCatalogUpdateWithoutTaskActionInputObjectSchema as SupplyCatalogUpdateWithoutTaskActionInputObjectSchema } from './SupplyCatalogUpdateWithoutTaskActionInput.schema';
import { SupplyCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema as SupplyCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema } from './SupplyCatalogUncheckedUpdateWithoutTaskActionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SupplyCatalogWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => SupplyCatalogUpdateWithoutTaskActionInputObjectSchema), z.lazy(() => SupplyCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema)])
}).strict();
export const SupplyCatalogUpdateToOneWithWhereWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.SupplyCatalogUpdateToOneWithWhereWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.SupplyCatalogUpdateToOneWithWhereWithoutTaskActionInput>;
export const SupplyCatalogUpdateToOneWithWhereWithoutTaskActionInputObjectZodSchema = makeSchema();
