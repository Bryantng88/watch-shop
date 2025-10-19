import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ServiceCatalogSelectObjectSchema as ServiceCatalogSelectObjectSchema } from './objects/ServiceCatalogSelect.schema';
import { ServiceCatalogIncludeObjectSchema as ServiceCatalogIncludeObjectSchema } from './objects/ServiceCatalogInclude.schema';
import { ServiceCatalogWhereUniqueInputObjectSchema as ServiceCatalogWhereUniqueInputObjectSchema } from './objects/ServiceCatalogWhereUniqueInput.schema';

export const ServiceCatalogDeleteOneSchema: z.ZodType<Prisma.ServiceCatalogDeleteArgs> = z.object({ select: ServiceCatalogSelectObjectSchema.optional(), include: ServiceCatalogIncludeObjectSchema.optional(), where: ServiceCatalogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ServiceCatalogDeleteArgs>;

export const ServiceCatalogDeleteOneZodSchema = z.object({ select: ServiceCatalogSelectObjectSchema.optional(), include: ServiceCatalogIncludeObjectSchema.optional(), where: ServiceCatalogWhereUniqueInputObjectSchema }).strict();