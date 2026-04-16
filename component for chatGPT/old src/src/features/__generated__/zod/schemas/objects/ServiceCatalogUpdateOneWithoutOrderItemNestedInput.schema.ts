import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogCreateWithoutOrderItemInputObjectSchema as ServiceCatalogCreateWithoutOrderItemInputObjectSchema } from './ServiceCatalogCreateWithoutOrderItemInput.schema';
import { ServiceCatalogUncheckedCreateWithoutOrderItemInputObjectSchema as ServiceCatalogUncheckedCreateWithoutOrderItemInputObjectSchema } from './ServiceCatalogUncheckedCreateWithoutOrderItemInput.schema';
import { ServiceCatalogCreateOrConnectWithoutOrderItemInputObjectSchema as ServiceCatalogCreateOrConnectWithoutOrderItemInputObjectSchema } from './ServiceCatalogCreateOrConnectWithoutOrderItemInput.schema';
import { ServiceCatalogUpsertWithoutOrderItemInputObjectSchema as ServiceCatalogUpsertWithoutOrderItemInputObjectSchema } from './ServiceCatalogUpsertWithoutOrderItemInput.schema';
import { ServiceCatalogWhereInputObjectSchema as ServiceCatalogWhereInputObjectSchema } from './ServiceCatalogWhereInput.schema';
import { ServiceCatalogWhereUniqueInputObjectSchema as ServiceCatalogWhereUniqueInputObjectSchema } from './ServiceCatalogWhereUniqueInput.schema';
import { ServiceCatalogUpdateToOneWithWhereWithoutOrderItemInputObjectSchema as ServiceCatalogUpdateToOneWithWhereWithoutOrderItemInputObjectSchema } from './ServiceCatalogUpdateToOneWithWhereWithoutOrderItemInput.schema';
import { ServiceCatalogUpdateWithoutOrderItemInputObjectSchema as ServiceCatalogUpdateWithoutOrderItemInputObjectSchema } from './ServiceCatalogUpdateWithoutOrderItemInput.schema';
import { ServiceCatalogUncheckedUpdateWithoutOrderItemInputObjectSchema as ServiceCatalogUncheckedUpdateWithoutOrderItemInputObjectSchema } from './ServiceCatalogUncheckedUpdateWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceCatalogCreateWithoutOrderItemInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedCreateWithoutOrderItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ServiceCatalogCreateOrConnectWithoutOrderItemInputObjectSchema).optional(),
  upsert: z.lazy(() => ServiceCatalogUpsertWithoutOrderItemInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ServiceCatalogWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ServiceCatalogWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ServiceCatalogUpdateToOneWithWhereWithoutOrderItemInputObjectSchema), z.lazy(() => ServiceCatalogUpdateWithoutOrderItemInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedUpdateWithoutOrderItemInputObjectSchema)]).optional()
}).strict();
export const ServiceCatalogUpdateOneWithoutOrderItemNestedInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUpdateOneWithoutOrderItemNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUpdateOneWithoutOrderItemNestedInput>;
export const ServiceCatalogUpdateOneWithoutOrderItemNestedInputObjectZodSchema = makeSchema();
