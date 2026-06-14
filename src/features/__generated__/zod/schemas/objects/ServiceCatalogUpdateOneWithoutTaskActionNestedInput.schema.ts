import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogCreateWithoutTaskActionInputObjectSchema as ServiceCatalogCreateWithoutTaskActionInputObjectSchema } from './ServiceCatalogCreateWithoutTaskActionInput.schema';
import { ServiceCatalogUncheckedCreateWithoutTaskActionInputObjectSchema as ServiceCatalogUncheckedCreateWithoutTaskActionInputObjectSchema } from './ServiceCatalogUncheckedCreateWithoutTaskActionInput.schema';
import { ServiceCatalogCreateOrConnectWithoutTaskActionInputObjectSchema as ServiceCatalogCreateOrConnectWithoutTaskActionInputObjectSchema } from './ServiceCatalogCreateOrConnectWithoutTaskActionInput.schema';
import { ServiceCatalogUpsertWithoutTaskActionInputObjectSchema as ServiceCatalogUpsertWithoutTaskActionInputObjectSchema } from './ServiceCatalogUpsertWithoutTaskActionInput.schema';
import { ServiceCatalogWhereInputObjectSchema as ServiceCatalogWhereInputObjectSchema } from './ServiceCatalogWhereInput.schema';
import { ServiceCatalogWhereUniqueInputObjectSchema as ServiceCatalogWhereUniqueInputObjectSchema } from './ServiceCatalogWhereUniqueInput.schema';
import { ServiceCatalogUpdateToOneWithWhereWithoutTaskActionInputObjectSchema as ServiceCatalogUpdateToOneWithWhereWithoutTaskActionInputObjectSchema } from './ServiceCatalogUpdateToOneWithWhereWithoutTaskActionInput.schema';
import { ServiceCatalogUpdateWithoutTaskActionInputObjectSchema as ServiceCatalogUpdateWithoutTaskActionInputObjectSchema } from './ServiceCatalogUpdateWithoutTaskActionInput.schema';
import { ServiceCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema as ServiceCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema } from './ServiceCatalogUncheckedUpdateWithoutTaskActionInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceCatalogCreateWithoutTaskActionInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedCreateWithoutTaskActionInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ServiceCatalogCreateOrConnectWithoutTaskActionInputObjectSchema).optional(),
  upsert: z.lazy(() => ServiceCatalogUpsertWithoutTaskActionInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ServiceCatalogWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ServiceCatalogWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ServiceCatalogUpdateToOneWithWhereWithoutTaskActionInputObjectSchema), z.lazy(() => ServiceCatalogUpdateWithoutTaskActionInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema)]).optional()
}).strict();
export const ServiceCatalogUpdateOneWithoutTaskActionNestedInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUpdateOneWithoutTaskActionNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUpdateOneWithoutTaskActionNestedInput>;
export const ServiceCatalogUpdateOneWithoutTaskActionNestedInputObjectZodSchema = makeSchema();
