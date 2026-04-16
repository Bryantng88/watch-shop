import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestUpdateWithoutTechnicalIssueInputObjectSchema as ServiceRequestUpdateWithoutTechnicalIssueInputObjectSchema } from './ServiceRequestUpdateWithoutTechnicalIssueInput.schema';
import { ServiceRequestUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as ServiceRequestUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutTechnicalIssueInput.schema';
import { ServiceRequestCreateWithoutTechnicalIssueInputObjectSchema as ServiceRequestCreateWithoutTechnicalIssueInputObjectSchema } from './ServiceRequestCreateWithoutTechnicalIssueInput.schema';
import { ServiceRequestUncheckedCreateWithoutTechnicalIssueInputObjectSchema as ServiceRequestUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutTechnicalIssueInput.schema';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ServiceRequestUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)]),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutTechnicalIssueInputObjectSchema)]),
  where: z.lazy(() => ServiceRequestWhereInputObjectSchema).optional()
}).strict();
export const ServiceRequestUpsertWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpsertWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpsertWithoutTechnicalIssueInput>;
export const ServiceRequestUpsertWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
