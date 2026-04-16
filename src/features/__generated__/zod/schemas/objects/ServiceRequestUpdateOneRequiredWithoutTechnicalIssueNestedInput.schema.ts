import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutTechnicalIssueInputObjectSchema as ServiceRequestCreateWithoutTechnicalIssueInputObjectSchema } from './ServiceRequestCreateWithoutTechnicalIssueInput.schema';
import { ServiceRequestUncheckedCreateWithoutTechnicalIssueInputObjectSchema as ServiceRequestUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutTechnicalIssueInput.schema';
import { ServiceRequestCreateOrConnectWithoutTechnicalIssueInputObjectSchema as ServiceRequestCreateOrConnectWithoutTechnicalIssueInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutTechnicalIssueInput.schema';
import { ServiceRequestUpsertWithoutTechnicalIssueInputObjectSchema as ServiceRequestUpsertWithoutTechnicalIssueInputObjectSchema } from './ServiceRequestUpsertWithoutTechnicalIssueInput.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema as ServiceRequestUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema } from './ServiceRequestUpdateToOneWithWhereWithoutTechnicalIssueInput.schema';
import { ServiceRequestUpdateWithoutTechnicalIssueInputObjectSchema as ServiceRequestUpdateWithoutTechnicalIssueInputObjectSchema } from './ServiceRequestUpdateWithoutTechnicalIssueInput.schema';
import { ServiceRequestUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as ServiceRequestUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutTechnicalIssueInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ServiceRequestCreateOrConnectWithoutTechnicalIssueInputObjectSchema).optional(),
  upsert: z.lazy(() => ServiceRequestUpsertWithoutTechnicalIssueInputObjectSchema).optional(),
  connect: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ServiceRequestUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema), z.lazy(() => ServiceRequestUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)]).optional()
}).strict();
export const ServiceRequestUpdateOneRequiredWithoutTechnicalIssueNestedInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateOneRequiredWithoutTechnicalIssueNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateOneRequiredWithoutTechnicalIssueNestedInput>;
export const ServiceRequestUpdateOneRequiredWithoutTechnicalIssueNestedInputObjectZodSchema = makeSchema();
