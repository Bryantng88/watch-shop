import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ServiceCatalogCreateManyInputObjectSchema as ServiceCatalogCreateManyInputObjectSchema } from './objects/ServiceCatalogCreateManyInput.schema';

export const ServiceCatalogCreateManySchema: z.ZodType<Prisma.ServiceCatalogCreateManyArgs> = z.object({ data: z.union([ ServiceCatalogCreateManyInputObjectSchema, z.array(ServiceCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ServiceCatalogCreateManyArgs>;

export const ServiceCatalogCreateManyZodSchema = z.object({ data: z.union([ ServiceCatalogCreateManyInputObjectSchema, z.array(ServiceCatalogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();