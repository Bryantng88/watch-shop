import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ServiceCatalogWhereInputObjectSchema as ServiceCatalogWhereInputObjectSchema } from './objects/ServiceCatalogWhereInput.schema';

export const ServiceCatalogDeleteManySchema: z.ZodType<Prisma.ServiceCatalogDeleteManyArgs> = z.object({ where: ServiceCatalogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ServiceCatalogDeleteManyArgs>;

export const ServiceCatalogDeleteManyZodSchema = z.object({ where: ServiceCatalogWhereInputObjectSchema.optional() }).strict();