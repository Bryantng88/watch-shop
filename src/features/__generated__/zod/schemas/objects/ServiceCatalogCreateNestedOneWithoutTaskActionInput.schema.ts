import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogCreateWithoutTaskActionInputObjectSchema as ServiceCatalogCreateWithoutTaskActionInputObjectSchema } from './ServiceCatalogCreateWithoutTaskActionInput.schema';
import { ServiceCatalogUncheckedCreateWithoutTaskActionInputObjectSchema as ServiceCatalogUncheckedCreateWithoutTaskActionInputObjectSchema } from './ServiceCatalogUncheckedCreateWithoutTaskActionInput.schema';
import { ServiceCatalogCreateOrConnectWithoutTaskActionInputObjectSchema as ServiceCatalogCreateOrConnectWithoutTaskActionInputObjectSchema } from './ServiceCatalogCreateOrConnectWithoutTaskActionInput.schema';
import { ServiceCatalogWhereUniqueInputObjectSchema as ServiceCatalogWhereUniqueInputObjectSchema } from './ServiceCatalogWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceCatalogCreateWithoutTaskActionInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedCreateWithoutTaskActionInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ServiceCatalogCreateOrConnectWithoutTaskActionInputObjectSchema).optional(),
  connect: z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema).optional()
}).strict();
export const ServiceCatalogCreateNestedOneWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.ServiceCatalogCreateNestedOneWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogCreateNestedOneWithoutTaskActionInput>;
export const ServiceCatalogCreateNestedOneWithoutTaskActionInputObjectZodSchema = makeSchema();
