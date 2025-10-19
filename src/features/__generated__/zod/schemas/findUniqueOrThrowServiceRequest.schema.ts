import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ServiceRequestSelectObjectSchema as ServiceRequestSelectObjectSchema } from './objects/ServiceRequestSelect.schema';
import { ServiceRequestIncludeObjectSchema as ServiceRequestIncludeObjectSchema } from './objects/ServiceRequestInclude.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './objects/ServiceRequestWhereUniqueInput.schema';

export const ServiceRequestFindUniqueOrThrowSchema: z.ZodType<Prisma.ServiceRequestFindUniqueOrThrowArgs> = z.object({ select: ServiceRequestSelectObjectSchema.optional(), include: ServiceRequestIncludeObjectSchema.optional(), where: ServiceRequestWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ServiceRequestFindUniqueOrThrowArgs>;

export const ServiceRequestFindUniqueOrThrowZodSchema = z.object({ select: ServiceRequestSelectObjectSchema.optional(), include: ServiceRequestIncludeObjectSchema.optional(), where: ServiceRequestWhereUniqueInputObjectSchema }).strict();