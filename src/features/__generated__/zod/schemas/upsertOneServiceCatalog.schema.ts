import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ServiceCatalogSelectObjectSchema as ServiceCatalogSelectObjectSchema } from './objects/ServiceCatalogSelect.schema';
import { ServiceCatalogIncludeObjectSchema as ServiceCatalogIncludeObjectSchema } from './objects/ServiceCatalogInclude.schema';
import { ServiceCatalogWhereUniqueInputObjectSchema as ServiceCatalogWhereUniqueInputObjectSchema } from './objects/ServiceCatalogWhereUniqueInput.schema';
import { ServiceCatalogCreateInputObjectSchema as ServiceCatalogCreateInputObjectSchema } from './objects/ServiceCatalogCreateInput.schema';
import { ServiceCatalogUncheckedCreateInputObjectSchema as ServiceCatalogUncheckedCreateInputObjectSchema } from './objects/ServiceCatalogUncheckedCreateInput.schema';
import { ServiceCatalogUpdateInputObjectSchema as ServiceCatalogUpdateInputObjectSchema } from './objects/ServiceCatalogUpdateInput.schema';
import { ServiceCatalogUncheckedUpdateInputObjectSchema as ServiceCatalogUncheckedUpdateInputObjectSchema } from './objects/ServiceCatalogUncheckedUpdateInput.schema';

export const ServiceCatalogUpsertOneSchema: z.ZodType<Prisma.ServiceCatalogUpsertArgs> = z.object({ select: ServiceCatalogSelectObjectSchema.optional(), include: ServiceCatalogIncludeObjectSchema.optional(), where: ServiceCatalogWhereUniqueInputObjectSchema, create: z.union([ ServiceCatalogCreateInputObjectSchema, ServiceCatalogUncheckedCreateInputObjectSchema ]), update: z.union([ ServiceCatalogUpdateInputObjectSchema, ServiceCatalogUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.ServiceCatalogUpsertArgs>;

export const ServiceCatalogUpsertOneZodSchema = z.object({ select: ServiceCatalogSelectObjectSchema.optional(), include: ServiceCatalogIncludeObjectSchema.optional(), where: ServiceCatalogWhereUniqueInputObjectSchema, create: z.union([ ServiceCatalogCreateInputObjectSchema, ServiceCatalogUncheckedCreateInputObjectSchema ]), update: z.union([ ServiceCatalogUpdateInputObjectSchema, ServiceCatalogUncheckedUpdateInputObjectSchema ]) }).strict();