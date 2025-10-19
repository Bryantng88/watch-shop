import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ServiceRequestSelectObjectSchema as ServiceRequestSelectObjectSchema } from './objects/ServiceRequestSelect.schema';
import { ServiceRequestIncludeObjectSchema as ServiceRequestIncludeObjectSchema } from './objects/ServiceRequestInclude.schema';
import { ServiceRequestCreateInputObjectSchema as ServiceRequestCreateInputObjectSchema } from './objects/ServiceRequestCreateInput.schema';
import { ServiceRequestUncheckedCreateInputObjectSchema as ServiceRequestUncheckedCreateInputObjectSchema } from './objects/ServiceRequestUncheckedCreateInput.schema';

export const ServiceRequestCreateOneSchema: z.ZodType<Prisma.ServiceRequestCreateArgs> = z.object({ select: ServiceRequestSelectObjectSchema.optional(), include: ServiceRequestIncludeObjectSchema.optional(), data: z.union([ServiceRequestCreateInputObjectSchema, ServiceRequestUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.ServiceRequestCreateArgs>;

export const ServiceRequestCreateOneZodSchema = z.object({ select: ServiceRequestSelectObjectSchema.optional(), include: ServiceRequestIncludeObjectSchema.optional(), data: z.union([ServiceRequestCreateInputObjectSchema, ServiceRequestUncheckedCreateInputObjectSchema]) }).strict();