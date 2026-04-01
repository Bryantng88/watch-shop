import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogUpdateWithoutTechnicalIssueInputObjectSchema as ServiceCatalogUpdateWithoutTechnicalIssueInputObjectSchema } from './ServiceCatalogUpdateWithoutTechnicalIssueInput.schema';
import { ServiceCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as ServiceCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './ServiceCatalogUncheckedUpdateWithoutTechnicalIssueInput.schema';
import { ServiceCatalogCreateWithoutTechnicalIssueInputObjectSchema as ServiceCatalogCreateWithoutTechnicalIssueInputObjectSchema } from './ServiceCatalogCreateWithoutTechnicalIssueInput.schema';
import { ServiceCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema as ServiceCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './ServiceCatalogUncheckedCreateWithoutTechnicalIssueInput.schema';
import { ServiceCatalogWhereInputObjectSchema as ServiceCatalogWhereInputObjectSchema } from './ServiceCatalogWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ServiceCatalogUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)]),
  create: z.union([z.lazy(() => ServiceCatalogCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema)]),
  where: z.lazy(() => ServiceCatalogWhereInputObjectSchema).optional()
}).strict();
export const ServiceCatalogUpsertWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUpsertWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUpsertWithoutTechnicalIssueInput>;
export const ServiceCatalogUpsertWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
