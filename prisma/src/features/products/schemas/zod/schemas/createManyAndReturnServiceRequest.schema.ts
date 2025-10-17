import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ServiceRequestSelectObjectSchema as ServiceRequestSelectObjectSchema } from './objects/ServiceRequestSelect.schema';
import { ServiceRequestCreateManyInputObjectSchema as ServiceRequestCreateManyInputObjectSchema } from './objects/ServiceRequestCreateManyInput.schema';

export const ServiceRequestCreateManyAndReturnSchema: z.ZodType<Prisma.ServiceRequestCreateManyAndReturnArgs> = z.object({ select: ServiceRequestSelectObjectSchema.optional(), data: z.union([ ServiceRequestCreateManyInputObjectSchema, z.array(ServiceRequestCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ServiceRequestCreateManyAndReturnArgs>;

export const ServiceRequestCreateManyAndReturnZodSchema = z.object({ select: ServiceRequestSelectObjectSchema.optional(), data: z.union([ ServiceRequestCreateManyInputObjectSchema, z.array(ServiceRequestCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();