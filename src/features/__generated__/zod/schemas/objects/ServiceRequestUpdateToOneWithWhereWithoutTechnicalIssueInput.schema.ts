import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema';
import { ServiceRequestUpdateWithoutTechnicalIssueInputObjectSchema as ServiceRequestUpdateWithoutTechnicalIssueInputObjectSchema } from './ServiceRequestUpdateWithoutTechnicalIssueInput.schema';
import { ServiceRequestUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as ServiceRequestUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ServiceRequestUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const ServiceRequestUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateToOneWithWhereWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateToOneWithWhereWithoutTechnicalIssueInput>;
export const ServiceRequestUpdateToOneWithWhereWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
