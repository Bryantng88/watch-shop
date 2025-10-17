import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ServiceRequestSelectObjectSchema as ServiceRequestSelectObjectSchema } from './objects/ServiceRequestSelect.schema';
import { ServiceRequestIncludeObjectSchema as ServiceRequestIncludeObjectSchema } from './objects/ServiceRequestInclude.schema';
import { ServiceRequestUpdateInputObjectSchema as ServiceRequestUpdateInputObjectSchema } from './objects/ServiceRequestUpdateInput.schema';
import { ServiceRequestUncheckedUpdateInputObjectSchema as ServiceRequestUncheckedUpdateInputObjectSchema } from './objects/ServiceRequestUncheckedUpdateInput.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './objects/ServiceRequestWhereUniqueInput.schema';

export const ServiceRequestUpdateOneSchema: z.ZodType<Prisma.ServiceRequestUpdateArgs> = z.object({ select: ServiceRequestSelectObjectSchema.optional(), include: ServiceRequestIncludeObjectSchema.optional(), data: z.union([ServiceRequestUpdateInputObjectSchema, ServiceRequestUncheckedUpdateInputObjectSchema]), where: ServiceRequestWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ServiceRequestUpdateArgs>;

export const ServiceRequestUpdateOneZodSchema = z.object({ select: ServiceRequestSelectObjectSchema.optional(), include: ServiceRequestIncludeObjectSchema.optional(), data: z.union([ServiceRequestUpdateInputObjectSchema, ServiceRequestUncheckedUpdateInputObjectSchema]), where: ServiceRequestWhereUniqueInputObjectSchema }).strict();