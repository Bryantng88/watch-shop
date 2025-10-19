import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ServiceRequestSelectObjectSchema as ServiceRequestSelectObjectSchema } from './objects/ServiceRequestSelect.schema';
import { ServiceRequestIncludeObjectSchema as ServiceRequestIncludeObjectSchema } from './objects/ServiceRequestInclude.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './objects/ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestCreateInputObjectSchema as ServiceRequestCreateInputObjectSchema } from './objects/ServiceRequestCreateInput.schema';
import { ServiceRequestUncheckedCreateInputObjectSchema as ServiceRequestUncheckedCreateInputObjectSchema } from './objects/ServiceRequestUncheckedCreateInput.schema';
import { ServiceRequestUpdateInputObjectSchema as ServiceRequestUpdateInputObjectSchema } from './objects/ServiceRequestUpdateInput.schema';
import { ServiceRequestUncheckedUpdateInputObjectSchema as ServiceRequestUncheckedUpdateInputObjectSchema } from './objects/ServiceRequestUncheckedUpdateInput.schema';

export const ServiceRequestUpsertOneSchema: z.ZodType<Prisma.ServiceRequestUpsertArgs> = z.object({ select: ServiceRequestSelectObjectSchema.optional(), include: ServiceRequestIncludeObjectSchema.optional(), where: ServiceRequestWhereUniqueInputObjectSchema, create: z.union([ ServiceRequestCreateInputObjectSchema, ServiceRequestUncheckedCreateInputObjectSchema ]), update: z.union([ ServiceRequestUpdateInputObjectSchema, ServiceRequestUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.ServiceRequestUpsertArgs>;

export const ServiceRequestUpsertOneZodSchema = z.object({ select: ServiceRequestSelectObjectSchema.optional(), include: ServiceRequestIncludeObjectSchema.optional(), where: ServiceRequestWhereUniqueInputObjectSchema, create: z.union([ ServiceRequestCreateInputObjectSchema, ServiceRequestUncheckedCreateInputObjectSchema ]), update: z.union([ ServiceRequestUpdateInputObjectSchema, ServiceRequestUncheckedUpdateInputObjectSchema ]) }).strict();