import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ServiceCatalogSelectObjectSchema as ServiceCatalogSelectObjectSchema } from './objects/ServiceCatalogSelect.schema';
import { ServiceCatalogUpdateManyMutationInputObjectSchema as ServiceCatalogUpdateManyMutationInputObjectSchema } from './objects/ServiceCatalogUpdateManyMutationInput.schema';
import { ServiceCatalogWhereInputObjectSchema as ServiceCatalogWhereInputObjectSchema } from './objects/ServiceCatalogWhereInput.schema';

export const ServiceCatalogUpdateManyAndReturnSchema: z.ZodType<Prisma.ServiceCatalogUpdateManyAndReturnArgs> = z.object({ select: ServiceCatalogSelectObjectSchema.optional(), data: ServiceCatalogUpdateManyMutationInputObjectSchema, where: ServiceCatalogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ServiceCatalogUpdateManyAndReturnArgs>;

export const ServiceCatalogUpdateManyAndReturnZodSchema = z.object({ select: ServiceCatalogSelectObjectSchema.optional(), data: ServiceCatalogUpdateManyMutationInputObjectSchema, where: ServiceCatalogWhereInputObjectSchema.optional() }).strict();