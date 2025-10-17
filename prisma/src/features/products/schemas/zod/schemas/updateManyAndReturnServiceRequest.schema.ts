import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ServiceRequestSelectObjectSchema as ServiceRequestSelectObjectSchema } from './objects/ServiceRequestSelect.schema';
import { ServiceRequestUpdateManyMutationInputObjectSchema as ServiceRequestUpdateManyMutationInputObjectSchema } from './objects/ServiceRequestUpdateManyMutationInput.schema';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './objects/ServiceRequestWhereInput.schema';

export const ServiceRequestUpdateManyAndReturnSchema: z.ZodType<Prisma.ServiceRequestUpdateManyAndReturnArgs> = z.object({ select: ServiceRequestSelectObjectSchema.optional(), data: ServiceRequestUpdateManyMutationInputObjectSchema, where: ServiceRequestWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ServiceRequestUpdateManyAndReturnArgs>;

export const ServiceRequestUpdateManyAndReturnZodSchema = z.object({ select: ServiceRequestSelectObjectSchema.optional(), data: ServiceRequestUpdateManyMutationInputObjectSchema, where: ServiceRequestWhereInputObjectSchema.optional() }).strict();