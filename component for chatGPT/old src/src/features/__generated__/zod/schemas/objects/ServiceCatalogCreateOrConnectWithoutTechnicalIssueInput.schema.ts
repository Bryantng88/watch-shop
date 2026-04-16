import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogWhereUniqueInputObjectSchema as ServiceCatalogWhereUniqueInputObjectSchema } from './ServiceCatalogWhereUniqueInput.schema';
import { ServiceCatalogCreateWithoutTechnicalIssueInputObjectSchema as ServiceCatalogCreateWithoutTechnicalIssueInputObjectSchema } from './ServiceCatalogCreateWithoutTechnicalIssueInput.schema';
import { ServiceCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema as ServiceCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './ServiceCatalogUncheckedCreateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ServiceCatalogCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const ServiceCatalogCreateOrConnectWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.ServiceCatalogCreateOrConnectWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogCreateOrConnectWithoutTechnicalIssueInput>;
export const ServiceCatalogCreateOrConnectWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
