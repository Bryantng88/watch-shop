import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ServiceCatalogSelectObjectSchema as ServiceCatalogSelectObjectSchema } from './objects/ServiceCatalogSelect.schema';
import { ServiceCatalogIncludeObjectSchema as ServiceCatalogIncludeObjectSchema } from './objects/ServiceCatalogInclude.schema';
import { ServiceCatalogWhereUniqueInputObjectSchema as ServiceCatalogWhereUniqueInputObjectSchema } from './objects/ServiceCatalogWhereUniqueInput.schema';

export const ServiceCatalogFindUniqueSchema: z.ZodType<Prisma.ServiceCatalogFindUniqueArgs> = z.object({ select: ServiceCatalogSelectObjectSchema.optional(), include: ServiceCatalogIncludeObjectSchema.optional(), where: ServiceCatalogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ServiceCatalogFindUniqueArgs>;

export const ServiceCatalogFindUniqueZodSchema = z.object({ select: ServiceCatalogSelectObjectSchema.optional(), include: ServiceCatalogIncludeObjectSchema.optional(), where: ServiceCatalogWhereUniqueInputObjectSchema }).strict();