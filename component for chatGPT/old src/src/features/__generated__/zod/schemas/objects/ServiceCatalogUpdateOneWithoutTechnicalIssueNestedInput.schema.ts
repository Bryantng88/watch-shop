import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogCreateWithoutTechnicalIssueInputObjectSchema as ServiceCatalogCreateWithoutTechnicalIssueInputObjectSchema } from './ServiceCatalogCreateWithoutTechnicalIssueInput.schema';
import { ServiceCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema as ServiceCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './ServiceCatalogUncheckedCreateWithoutTechnicalIssueInput.schema';
import { ServiceCatalogCreateOrConnectWithoutTechnicalIssueInputObjectSchema as ServiceCatalogCreateOrConnectWithoutTechnicalIssueInputObjectSchema } from './ServiceCatalogCreateOrConnectWithoutTechnicalIssueInput.schema';
import { ServiceCatalogUpsertWithoutTechnicalIssueInputObjectSchema as ServiceCatalogUpsertWithoutTechnicalIssueInputObjectSchema } from './ServiceCatalogUpsertWithoutTechnicalIssueInput.schema';
import { ServiceCatalogWhereInputObjectSchema as ServiceCatalogWhereInputObjectSchema } from './ServiceCatalogWhereInput.schema';
import { ServiceCatalogWhereUniqueInputObjectSchema as ServiceCatalogWhereUniqueInputObjectSchema } from './ServiceCatalogWhereUniqueInput.schema';
import { ServiceCatalogUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema as ServiceCatalogUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema } from './ServiceCatalogUpdateToOneWithWhereWithoutTechnicalIssueInput.schema';
import { ServiceCatalogUpdateWithoutTechnicalIssueInputObjectSchema as ServiceCatalogUpdateWithoutTechnicalIssueInputObjectSchema } from './ServiceCatalogUpdateWithoutTechnicalIssueInput.schema';
import { ServiceCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as ServiceCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './ServiceCatalogUncheckedUpdateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceCatalogCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ServiceCatalogCreateOrConnectWithoutTechnicalIssueInputObjectSchema).optional(),
  upsert: z.lazy(() => ServiceCatalogUpsertWithoutTechnicalIssueInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ServiceCatalogWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ServiceCatalogWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ServiceCatalogUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema), z.lazy(() => ServiceCatalogUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)]).optional()
}).strict();
export const ServiceCatalogUpdateOneWithoutTechnicalIssueNestedInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUpdateOneWithoutTechnicalIssueNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUpdateOneWithoutTechnicalIssueNestedInput>;
export const ServiceCatalogUpdateOneWithoutTechnicalIssueNestedInputObjectZodSchema = makeSchema();
