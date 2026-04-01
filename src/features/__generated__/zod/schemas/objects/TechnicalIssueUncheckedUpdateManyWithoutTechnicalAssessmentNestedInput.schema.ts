import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateWithoutTechnicalAssessmentInputObjectSchema as TechnicalIssueCreateWithoutTechnicalAssessmentInputObjectSchema } from './TechnicalIssueCreateWithoutTechnicalAssessmentInput.schema';
import { TechnicalIssueUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema as TechnicalIssueUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutTechnicalAssessmentInput.schema';
import { TechnicalIssueCreateOrConnectWithoutTechnicalAssessmentInputObjectSchema as TechnicalIssueCreateOrConnectWithoutTechnicalAssessmentInputObjectSchema } from './TechnicalIssueCreateOrConnectWithoutTechnicalAssessmentInput.schema';
import { TechnicalIssueUpsertWithWhereUniqueWithoutTechnicalAssessmentInputObjectSchema as TechnicalIssueUpsertWithWhereUniqueWithoutTechnicalAssessmentInputObjectSchema } from './TechnicalIssueUpsertWithWhereUniqueWithoutTechnicalAssessmentInput.schema';
import { TechnicalIssueCreateManyTechnicalAssessmentInputEnvelopeObjectSchema as TechnicalIssueCreateManyTechnicalAssessmentInputEnvelopeObjectSchema } from './TechnicalIssueCreateManyTechnicalAssessmentInputEnvelope.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateWithWhereUniqueWithoutTechnicalAssessmentInputObjectSchema as TechnicalIssueUpdateWithWhereUniqueWithoutTechnicalAssessmentInputObjectSchema } from './TechnicalIssueUpdateWithWhereUniqueWithoutTechnicalAssessmentInput.schema';
import { TechnicalIssueUpdateManyWithWhereWithoutTechnicalAssessmentInputObjectSchema as TechnicalIssueUpdateManyWithWhereWithoutTechnicalAssessmentInputObjectSchema } from './TechnicalIssueUpdateManyWithWhereWithoutTechnicalAssessmentInput.schema';
import { TechnicalIssueScalarWhereInputObjectSchema as TechnicalIssueScalarWhereInputObjectSchema } from './TechnicalIssueScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => TechnicalIssueCreateWithoutTechnicalAssessmentInputObjectSchema).array(), z.lazy(() => TechnicalIssueUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TechnicalIssueCreateOrConnectWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => TechnicalIssueCreateOrConnectWithoutTechnicalAssessmentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TechnicalIssueUpsertWithWhereUniqueWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => TechnicalIssueUpsertWithWhereUniqueWithoutTechnicalAssessmentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TechnicalIssueCreateManyTechnicalAssessmentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema), z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TechnicalIssueUpdateWithWhereUniqueWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => TechnicalIssueUpdateWithWhereUniqueWithoutTechnicalAssessmentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TechnicalIssueUpdateManyWithWhereWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => TechnicalIssueUpdateManyWithWhereWithoutTechnicalAssessmentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema), z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TechnicalIssueUncheckedUpdateManyWithoutTechnicalAssessmentNestedInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUncheckedUpdateManyWithoutTechnicalAssessmentNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUncheckedUpdateManyWithoutTechnicalAssessmentNestedInput>;
export const TechnicalIssueUncheckedUpdateManyWithoutTechnicalAssessmentNestedInputObjectZodSchema = makeSchema();
