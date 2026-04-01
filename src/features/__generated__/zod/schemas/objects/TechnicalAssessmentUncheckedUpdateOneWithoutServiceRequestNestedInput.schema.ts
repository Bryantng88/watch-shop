import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentCreateWithoutServiceRequestInputObjectSchema as TechnicalAssessmentCreateWithoutServiceRequestInputObjectSchema } from './TechnicalAssessmentCreateWithoutServiceRequestInput.schema';
import { TechnicalAssessmentUncheckedCreateWithoutServiceRequestInputObjectSchema as TechnicalAssessmentUncheckedCreateWithoutServiceRequestInputObjectSchema } from './TechnicalAssessmentUncheckedCreateWithoutServiceRequestInput.schema';
import { TechnicalAssessmentCreateOrConnectWithoutServiceRequestInputObjectSchema as TechnicalAssessmentCreateOrConnectWithoutServiceRequestInputObjectSchema } from './TechnicalAssessmentCreateOrConnectWithoutServiceRequestInput.schema';
import { TechnicalAssessmentUpsertWithoutServiceRequestInputObjectSchema as TechnicalAssessmentUpsertWithoutServiceRequestInputObjectSchema } from './TechnicalAssessmentUpsertWithoutServiceRequestInput.schema';
import { TechnicalAssessmentWhereInputObjectSchema as TechnicalAssessmentWhereInputObjectSchema } from './TechnicalAssessmentWhereInput.schema';
import { TechnicalAssessmentWhereUniqueInputObjectSchema as TechnicalAssessmentWhereUniqueInputObjectSchema } from './TechnicalAssessmentWhereUniqueInput.schema';
import { TechnicalAssessmentUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema as TechnicalAssessmentUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema } from './TechnicalAssessmentUpdateToOneWithWhereWithoutServiceRequestInput.schema';
import { TechnicalAssessmentUpdateWithoutServiceRequestInputObjectSchema as TechnicalAssessmentUpdateWithoutServiceRequestInputObjectSchema } from './TechnicalAssessmentUpdateWithoutServiceRequestInput.schema';
import { TechnicalAssessmentUncheckedUpdateWithoutServiceRequestInputObjectSchema as TechnicalAssessmentUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './TechnicalAssessmentUncheckedUpdateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalAssessmentCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => TechnicalAssessmentUncheckedCreateWithoutServiceRequestInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TechnicalAssessmentCreateOrConnectWithoutServiceRequestInputObjectSchema).optional(),
  upsert: z.lazy(() => TechnicalAssessmentUpsertWithoutServiceRequestInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => TechnicalAssessmentWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => TechnicalAssessmentWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => TechnicalAssessmentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TechnicalAssessmentUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema), z.lazy(() => TechnicalAssessmentUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => TechnicalAssessmentUncheckedUpdateWithoutServiceRequestInputObjectSchema)]).optional()
}).strict();
export const TechnicalAssessmentUncheckedUpdateOneWithoutServiceRequestNestedInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentUncheckedUpdateOneWithoutServiceRequestNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentUncheckedUpdateOneWithoutServiceRequestNestedInput>;
export const TechnicalAssessmentUncheckedUpdateOneWithoutServiceRequestNestedInputObjectZodSchema = makeSchema();
