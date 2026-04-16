import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ServiceCatalogSelectObjectSchema as ServiceCatalogSelectObjectSchema } from './objects/ServiceCatalogSelect.schema';
import { ServiceCatalogIncludeObjectSchema as ServiceCatalogIncludeObjectSchema } from './objects/ServiceCatalogInclude.schema';
import { ServiceCatalogUpdateInputObjectSchema as ServiceCatalogUpdateInputObjectSchema } from './objects/ServiceCatalogUpdateInput.schema';
import { ServiceCatalogUncheckedUpdateInputObjectSchema as ServiceCatalogUncheckedUpdateInputObjectSchema } from './objects/ServiceCatalogUncheckedUpdateInput.schema';
import { ServiceCatalogWhereUniqueInputObjectSchema as ServiceCatalogWhereUniqueInputObjectSchema } from './objects/ServiceCatalogWhereUniqueInput.schema';

export const ServiceCatalogUpdateOneSchema: z.ZodType<Prisma.ServiceCatalogUpdateArgs> = z.object({ select: ServiceCatalogSelectObjectSchema.optional(), include: ServiceCatalogIncludeObjectSchema.optional(), data: z.union([ServiceCatalogUpdateInputObjectSchema, ServiceCatalogUncheckedUpdateInputObjectSchema]), where: ServiceCatalogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ServiceCatalogUpdateArgs>;

export const ServiceCatalogUpdateOneZodSchema = z.object({ select: ServiceCatalogSelectObjectSchema.optional(), include: ServiceCatalogIncludeObjectSchema.optional(), data: z.union([ServiceCatalogUpdateInputObjectSchema, ServiceCatalogUncheckedUpdateInputObjectSchema]), where: ServiceCatalogWhereUniqueInputObjectSchema }).strict();