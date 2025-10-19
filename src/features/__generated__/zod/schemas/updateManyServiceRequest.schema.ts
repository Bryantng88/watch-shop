import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ServiceRequestUpdateManyMutationInputObjectSchema as ServiceRequestUpdateManyMutationInputObjectSchema } from './objects/ServiceRequestUpdateManyMutationInput.schema';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './objects/ServiceRequestWhereInput.schema';

export const ServiceRequestUpdateManySchema: z.ZodType<Prisma.ServiceRequestUpdateManyArgs> = z.object({ data: ServiceRequestUpdateManyMutationInputObjectSchema, where: ServiceRequestWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ServiceRequestUpdateManyArgs>;

export const ServiceRequestUpdateManyZodSchema = z.object({ data: ServiceRequestUpdateManyMutationInputObjectSchema, where: ServiceRequestWhereInputObjectSchema.optional() }).strict();