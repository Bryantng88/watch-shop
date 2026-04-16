import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestCreateWithoutTechnicalIssueInputObjectSchema as ServiceRequestCreateWithoutTechnicalIssueInputObjectSchema } from './ServiceRequestCreateWithoutTechnicalIssueInput.schema';
import { ServiceRequestUncheckedCreateWithoutTechnicalIssueInputObjectSchema as ServiceRequestUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const ServiceRequestCreateOrConnectWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutTechnicalIssueInput>;
export const ServiceRequestCreateOrConnectWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
