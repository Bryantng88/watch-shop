import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogCreateWithoutServiceRequestInputObjectSchema as ServiceCatalogCreateWithoutServiceRequestInputObjectSchema } from './ServiceCatalogCreateWithoutServiceRequestInput.schema';
import { ServiceCatalogUncheckedCreateWithoutServiceRequestInputObjectSchema as ServiceCatalogUncheckedCreateWithoutServiceRequestInputObjectSchema } from './ServiceCatalogUncheckedCreateWithoutServiceRequestInput.schema';
import { ServiceCatalogCreateOrConnectWithoutServiceRequestInputObjectSchema as ServiceCatalogCreateOrConnectWithoutServiceRequestInputObjectSchema } from './ServiceCatalogCreateOrConnectWithoutServiceRequestInput.schema';
import { ServiceCatalogUpsertWithoutServiceRequestInputObjectSchema as ServiceCatalogUpsertWithoutServiceRequestInputObjectSchema } from './ServiceCatalogUpsertWithoutServiceRequestInput.schema';
import { ServiceCatalogWhereInputObjectSchema as ServiceCatalogWhereInputObjectSchema } from './ServiceCatalogWhereInput.schema';
import { ServiceCatalogWhereUniqueInputObjectSchema as ServiceCatalogWhereUniqueInputObjectSchema } from './ServiceCatalogWhereUniqueInput.schema';
import { ServiceCatalogUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema as ServiceCatalogUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema } from './ServiceCatalogUpdateToOneWithWhereWithoutServiceRequestInput.schema';
import { ServiceCatalogUpdateWithoutServiceRequestInputObjectSchema as ServiceCatalogUpdateWithoutServiceRequestInputObjectSchema } from './ServiceCatalogUpdateWithoutServiceRequestInput.schema';
import { ServiceCatalogUncheckedUpdateWithoutServiceRequestInputObjectSchema as ServiceCatalogUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './ServiceCatalogUncheckedUpdateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceCatalogCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedCreateWithoutServiceRequestInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ServiceCatalogCreateOrConnectWithoutServiceRequestInputObjectSchema).optional(),
  upsert: z.lazy(() => ServiceCatalogUpsertWithoutServiceRequestInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ServiceCatalogWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ServiceCatalogWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ServiceCatalogUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema), z.lazy(() => ServiceCatalogUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedUpdateWithoutServiceRequestInputObjectSchema)]).optional()
}).strict();
export const ServiceCatalogUpdateOneWithoutServiceRequestNestedInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUpdateOneWithoutServiceRequestNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUpdateOneWithoutServiceRequestNestedInput>;
export const ServiceCatalogUpdateOneWithoutServiceRequestNestedInputObjectZodSchema = makeSchema();
