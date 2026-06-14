import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogWhereUniqueInputObjectSchema as ServiceCatalogWhereUniqueInputObjectSchema } from './ServiceCatalogWhereUniqueInput.schema';
import { ServiceCatalogCreateWithoutTaskActionInputObjectSchema as ServiceCatalogCreateWithoutTaskActionInputObjectSchema } from './ServiceCatalogCreateWithoutTaskActionInput.schema';
import { ServiceCatalogUncheckedCreateWithoutTaskActionInputObjectSchema as ServiceCatalogUncheckedCreateWithoutTaskActionInputObjectSchema } from './ServiceCatalogUncheckedCreateWithoutTaskActionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ServiceCatalogCreateWithoutTaskActionInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedCreateWithoutTaskActionInputObjectSchema)])
}).strict();
export const ServiceCatalogCreateOrConnectWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.ServiceCatalogCreateOrConnectWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogCreateOrConnectWithoutTaskActionInput>;
export const ServiceCatalogCreateOrConnectWithoutTaskActionInputObjectZodSchema = makeSchema();
