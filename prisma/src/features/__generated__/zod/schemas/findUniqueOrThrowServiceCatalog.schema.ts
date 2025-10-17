import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ServiceCatalogSelectObjectSchema as ServiceCatalogSelectObjectSchema } from './objects/ServiceCatalogSelect.schema';
import { ServiceCatalogIncludeObjectSchema as ServiceCatalogIncludeObjectSchema } from './objects/ServiceCatalogInclude.schema';
import { ServiceCatalogWhereUniqueInputObjectSchema as ServiceCatalogWhereUniqueInputObjectSchema } from './objects/ServiceCatalogWhereUniqueInput.schema';

export const ServiceCatalogFindUniqueOrThrowSchema: z.ZodType<Prisma.ServiceCatalogFindUniqueOrThrowArgs> = z.object({ select: ServiceCatalogSelectObjectSchema.optional(), include: ServiceCatalogIncludeObjectSchema.optional(), where: ServiceCatalogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ServiceCatalogFindUniqueOrThrowArgs>;

export const ServiceCatalogFindUniqueOrThrowZodSchema = z.object({ select: ServiceCatalogSelectObjectSchema.optional(), include: ServiceCatalogIncludeObjectSchema.optional(), where: ServiceCatalogWhereUniqueInputObjectSchema }).strict();