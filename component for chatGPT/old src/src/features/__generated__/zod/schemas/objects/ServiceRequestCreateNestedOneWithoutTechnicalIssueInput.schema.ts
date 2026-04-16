import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutTechnicalIssueInputObjectSchema as ServiceRequestCreateWithoutTechnicalIssueInputObjectSchema } from './ServiceRequestCreateWithoutTechnicalIssueInput.schema';
import { ServiceRequestUncheckedCreateWithoutTechnicalIssueInputObjectSchema as ServiceRequestUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutTechnicalIssueInput.schema';
import { ServiceRequestCreateOrConnectWithoutTechnicalIssueInputObjectSchema as ServiceRequestCreateOrConnectWithoutTechnicalIssueInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutTechnicalIssueInput.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutTechnicalIssueInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ServiceRequestCreateOrConnectWithoutTechnicalIssueInputObjectSchema).optional(),
  connect: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).optional()
}).strict();
export const ServiceRequestCreateNestedOneWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateNestedOneWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateNestedOneWithoutTechnicalIssueInput>;
export const ServiceRequestCreateNestedOneWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
