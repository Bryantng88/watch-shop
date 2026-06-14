import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SupplyCatalogWhereUniqueInputObjectSchema as SupplyCatalogWhereUniqueInputObjectSchema } from './SupplyCatalogWhereUniqueInput.schema';
import { SupplyCatalogCreateWithoutTaskActionInputObjectSchema as SupplyCatalogCreateWithoutTaskActionInputObjectSchema } from './SupplyCatalogCreateWithoutTaskActionInput.schema';
import { SupplyCatalogUncheckedCreateWithoutTaskActionInputObjectSchema as SupplyCatalogUncheckedCreateWithoutTaskActionInputObjectSchema } from './SupplyCatalogUncheckedCreateWithoutTaskActionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SupplyCatalogWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => SupplyCatalogCreateWithoutTaskActionInputObjectSchema), z.lazy(() => SupplyCatalogUncheckedCreateWithoutTaskActionInputObjectSchema)])
}).strict();
export const SupplyCatalogCreateOrConnectWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.SupplyCatalogCreateOrConnectWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.SupplyCatalogCreateOrConnectWithoutTaskActionInput>;
export const SupplyCatalogCreateOrConnectWithoutTaskActionInputObjectZodSchema = makeSchema();
