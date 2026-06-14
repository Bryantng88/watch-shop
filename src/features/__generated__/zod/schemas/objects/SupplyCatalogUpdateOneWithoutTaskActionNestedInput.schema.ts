import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SupplyCatalogCreateWithoutTaskActionInputObjectSchema as SupplyCatalogCreateWithoutTaskActionInputObjectSchema } from './SupplyCatalogCreateWithoutTaskActionInput.schema';
import { SupplyCatalogUncheckedCreateWithoutTaskActionInputObjectSchema as SupplyCatalogUncheckedCreateWithoutTaskActionInputObjectSchema } from './SupplyCatalogUncheckedCreateWithoutTaskActionInput.schema';
import { SupplyCatalogCreateOrConnectWithoutTaskActionInputObjectSchema as SupplyCatalogCreateOrConnectWithoutTaskActionInputObjectSchema } from './SupplyCatalogCreateOrConnectWithoutTaskActionInput.schema';
import { SupplyCatalogUpsertWithoutTaskActionInputObjectSchema as SupplyCatalogUpsertWithoutTaskActionInputObjectSchema } from './SupplyCatalogUpsertWithoutTaskActionInput.schema';
import { SupplyCatalogWhereInputObjectSchema as SupplyCatalogWhereInputObjectSchema } from './SupplyCatalogWhereInput.schema';
import { SupplyCatalogWhereUniqueInputObjectSchema as SupplyCatalogWhereUniqueInputObjectSchema } from './SupplyCatalogWhereUniqueInput.schema';
import { SupplyCatalogUpdateToOneWithWhereWithoutTaskActionInputObjectSchema as SupplyCatalogUpdateToOneWithWhereWithoutTaskActionInputObjectSchema } from './SupplyCatalogUpdateToOneWithWhereWithoutTaskActionInput.schema';
import { SupplyCatalogUpdateWithoutTaskActionInputObjectSchema as SupplyCatalogUpdateWithoutTaskActionInputObjectSchema } from './SupplyCatalogUpdateWithoutTaskActionInput.schema';
import { SupplyCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema as SupplyCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema } from './SupplyCatalogUncheckedUpdateWithoutTaskActionInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SupplyCatalogCreateWithoutTaskActionInputObjectSchema), z.lazy(() => SupplyCatalogUncheckedCreateWithoutTaskActionInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => SupplyCatalogCreateOrConnectWithoutTaskActionInputObjectSchema).optional(),
  upsert: z.lazy(() => SupplyCatalogUpsertWithoutTaskActionInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => SupplyCatalogWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => SupplyCatalogWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => SupplyCatalogWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => SupplyCatalogUpdateToOneWithWhereWithoutTaskActionInputObjectSchema), z.lazy(() => SupplyCatalogUpdateWithoutTaskActionInputObjectSchema), z.lazy(() => SupplyCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema)]).optional()
}).strict();
export const SupplyCatalogUpdateOneWithoutTaskActionNestedInputObjectSchema: z.ZodType<Prisma.SupplyCatalogUpdateOneWithoutTaskActionNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.SupplyCatalogUpdateOneWithoutTaskActionNestedInput>;
export const SupplyCatalogUpdateOneWithoutTaskActionNestedInputObjectZodSchema = makeSchema();
