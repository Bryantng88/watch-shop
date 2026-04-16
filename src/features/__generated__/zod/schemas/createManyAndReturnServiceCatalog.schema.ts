import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ServiceCatalogSelectObjectSchema as ServiceCatalogSelectObjectSchema } from './objects/ServiceCatalogSelect.schema';
import { ServiceCatalogCreateManyInputObjectSchema as ServiceCatalogCreateManyInputObjectSchema } from './objects/ServiceCatalogCreateManyInput.schema';

export const ServiceCatalogCreateManyAndReturnSchema: z.ZodType<Prisma.ServiceCatalogCreateManyAndReturnArgs> = z.object({ select: ServiceCatalogSelectObjectSchema.optional(), data: z.union([ ServiceCatalogCreateManyInputObjectSchema, z.array(ServiceCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ServiceCatalogCreateManyAndReturnArgs>;

export const ServiceCatalogCreateManyAndReturnZodSchema = z.object({ select: ServiceCatalogSelectObjectSchema.optional(), data: z.union([ ServiceCatalogCreateManyInputObjectSchema, z.array(ServiceCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();