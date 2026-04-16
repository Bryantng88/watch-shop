import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ServiceCatalogUpdateManyMutationInputObjectSchema as ServiceCatalogUpdateManyMutationInputObjectSchema } from './objects/ServiceCatalogUpdateManyMutationInput.schema';
import { ServiceCatalogWhereInputObjectSchema as ServiceCatalogWhereInputObjectSchema } from './objects/ServiceCatalogWhereInput.schema';

export const ServiceCatalogUpdateManySchema: z.ZodType<Prisma.ServiceCatalogUpdateManyArgs> = z.object({ data: ServiceCatalogUpdateManyMutationInputObjectSchema, where: ServiceCatalogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ServiceCatalogUpdateManyArgs>;

export const ServiceCatalogUpdateManyZodSchema = z.object({ data: ServiceCatalogUpdateManyMutationInputObjectSchema, where: ServiceCatalogWhereInputObjectSchema.optional() }).strict();