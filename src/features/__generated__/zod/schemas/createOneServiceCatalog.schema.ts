import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ServiceCatalogSelectObjectSchema as ServiceCatalogSelectObjectSchema } from './objects/ServiceCatalogSelect.schema';
import { ServiceCatalogIncludeObjectSchema as ServiceCatalogIncludeObjectSchema } from './objects/ServiceCatalogInclude.schema';
import { ServiceCatalogCreateInputObjectSchema as ServiceCatalogCreateInputObjectSchema } from './objects/ServiceCatalogCreateInput.schema';
import { ServiceCatalogUncheckedCreateInputObjectSchema as ServiceCatalogUncheckedCreateInputObjectSchema } from './objects/ServiceCatalogUncheckedCreateInput.schema';

export const ServiceCatalogCreateOneSchema: z.ZodType<Prisma.ServiceCatalogCreateArgs> = z.object({ select: ServiceCatalogSelectObjectSchema.optional(), include: ServiceCatalogIncludeObjectSchema.optional(), data: z.union([ServiceCatalogCreateInputObjectSchema, ServiceCatalogUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.ServiceCatalogCreateArgs>;

export const ServiceCatalogCreateOneZodSchema = z.object({ select: ServiceCatalogSelectObjectSchema.optional(), include: ServiceCatalogIncludeObjectSchema.optional(), data: z.union([ServiceCatalogCreateInputObjectSchema, ServiceCatalogUncheckedCreateInputObjectSchema]) }).strict();