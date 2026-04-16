import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogWhereInputObjectSchema as ServiceCatalogWhereInputObjectSchema } from './ServiceCatalogWhereInput.schema';
import { ServiceCatalogUpdateWithoutTechnicalIssueInputObjectSchema as ServiceCatalogUpdateWithoutTechnicalIssueInputObjectSchema } from './ServiceCatalogUpdateWithoutTechnicalIssueInput.schema';
import { ServiceCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as ServiceCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './ServiceCatalogUncheckedUpdateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceCatalogWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ServiceCatalogUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const ServiceCatalogUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUpdateToOneWithWhereWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUpdateToOneWithWhereWithoutTechnicalIssueInput>;
export const ServiceCatalogUpdateToOneWithWhereWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
