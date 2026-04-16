import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './objects/ServiceRequestWhereInput.schema';

export const ServiceRequestDeleteManySchema: z.ZodType<Prisma.ServiceRequestDeleteManyArgs> = z.object({ where: ServiceRequestWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ServiceRequestDeleteManyArgs>;

export const ServiceRequestDeleteManyZodSchema = z.object({ where: ServiceRequestWhereInputObjectSchema.optional() }).strict();