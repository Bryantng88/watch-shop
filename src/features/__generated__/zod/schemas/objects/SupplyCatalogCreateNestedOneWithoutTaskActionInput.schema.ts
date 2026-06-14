import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SupplyCatalogCreateWithoutTaskActionInputObjectSchema as SupplyCatalogCreateWithoutTaskActionInputObjectSchema } from './SupplyCatalogCreateWithoutTaskActionInput.schema';
import { SupplyCatalogUncheckedCreateWithoutTaskActionInputObjectSchema as SupplyCatalogUncheckedCreateWithoutTaskActionInputObjectSchema } from './SupplyCatalogUncheckedCreateWithoutTaskActionInput.schema';
import { SupplyCatalogCreateOrConnectWithoutTaskActionInputObjectSchema as SupplyCatalogCreateOrConnectWithoutTaskActionInputObjectSchema } from './SupplyCatalogCreateOrConnectWithoutTaskActionInput.schema';
import { SupplyCatalogWhereUniqueInputObjectSchema as SupplyCatalogWhereUniqueInputObjectSchema } from './SupplyCatalogWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SupplyCatalogCreateWithoutTaskActionInputObjectSchema), z.lazy(() => SupplyCatalogUncheckedCreateWithoutTaskActionInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => SupplyCatalogCreateOrConnectWithoutTaskActionInputObjectSchema).optional(),
  connect: z.lazy(() => SupplyCatalogWhereUniqueInputObjectSchema).optional()
}).strict();
export const SupplyCatalogCreateNestedOneWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.SupplyCatalogCreateNestedOneWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.SupplyCatalogCreateNestedOneWithoutTaskActionInput>;
export const SupplyCatalogCreateNestedOneWithoutTaskActionInputObjectZodSchema = makeSchema();
