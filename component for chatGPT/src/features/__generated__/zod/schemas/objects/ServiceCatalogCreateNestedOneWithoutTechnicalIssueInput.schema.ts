import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogCreateWithoutTechnicalIssueInputObjectSchema as ServiceCatalogCreateWithoutTechnicalIssueInputObjectSchema } from './ServiceCatalogCreateWithoutTechnicalIssueInput.schema';
import { ServiceCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema as ServiceCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './ServiceCatalogUncheckedCreateWithoutTechnicalIssueInput.schema';
import { ServiceCatalogCreateOrConnectWithoutTechnicalIssueInputObjectSchema as ServiceCatalogCreateOrConnectWithoutTechnicalIssueInputObjectSchema } from './ServiceCatalogCreateOrConnectWithoutTechnicalIssueInput.schema';
import { ServiceCatalogWhereUniqueInputObjectSchema as ServiceCatalogWhereUniqueInputObjectSchema } from './ServiceCatalogWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceCatalogCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ServiceCatalogCreateOrConnectWithoutTechnicalIssueInputObjectSchema).optional(),
  connect: z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema).optional()
}).strict();
export const ServiceCatalogCreateNestedOneWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.ServiceCatalogCreateNestedOneWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogCreateNestedOneWithoutTechnicalIssueInput>;
export const ServiceCatalogCreateNestedOneWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
