import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ServiceRequestCreateManyInputObjectSchema as ServiceRequestCreateManyInputObjectSchema } from './objects/ServiceRequestCreateManyInput.schema';

export const ServiceRequestCreateManySchema: z.ZodType<Prisma.ServiceRequestCreateManyArgs> = z.object({ data: z.union([ ServiceRequestCreateManyInputObjectSchema, z.array(ServiceRequestCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ServiceRequestCreateManyArgs>;

export const ServiceRequestCreateManyZodSchema = z.object({ data: z.union([ ServiceRequestCreateManyInputObjectSchema, z.array(ServiceRequestCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();