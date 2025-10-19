import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ServiceRequestSelectObjectSchema as ServiceRequestSelectObjectSchema } from './objects/ServiceRequestSelect.schema';
import { ServiceRequestIncludeObjectSchema as ServiceRequestIncludeObjectSchema } from './objects/ServiceRequestInclude.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './objects/ServiceRequestWhereUniqueInput.schema';

export const ServiceRequestDeleteOneSchema: z.ZodType<Prisma.ServiceRequestDeleteArgs> = z.object({ select: ServiceRequestSelectObjectSchema.optional(), include: ServiceRequestIncludeObjectSchema.optional(), where: ServiceRequestWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ServiceRequestDeleteArgs>;

export const ServiceRequestDeleteOneZodSchema = z.object({ select: ServiceRequestSelectObjectSchema.optional(), include: ServiceRequestIncludeObjectSchema.optional(), where: ServiceRequestWhereUniqueInputObjectSchema }).strict();