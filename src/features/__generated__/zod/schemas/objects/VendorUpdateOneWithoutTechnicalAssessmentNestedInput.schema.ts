import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorCreateWithoutTechnicalAssessmentInputObjectSchema as VendorCreateWithoutTechnicalAssessmentInputObjectSchema } from './VendorCreateWithoutTechnicalAssessmentInput.schema';
import { VendorUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema as VendorUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema } from './VendorUncheckedCreateWithoutTechnicalAssessmentInput.schema';
import { VendorCreateOrConnectWithoutTechnicalAssessmentInputObjectSchema as VendorCreateOrConnectWithoutTechnicalAssessmentInputObjectSchema } from './VendorCreateOrConnectWithoutTechnicalAssessmentInput.schema';
import { VendorUpsertWithoutTechnicalAssessmentInputObjectSchema as VendorUpsertWithoutTechnicalAssessmentInputObjectSchema } from './VendorUpsertWithoutTechnicalAssessmentInput.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema';
import { VendorUpdateToOneWithWhereWithoutTechnicalAssessmentInputObjectSchema as VendorUpdateToOneWithWhereWithoutTechnicalAssessmentInputObjectSchema } from './VendorUpdateToOneWithWhereWithoutTechnicalAssessmentInput.schema';
import { VendorUpdateWithoutTechnicalAssessmentInputObjectSchema as VendorUpdateWithoutTechnicalAssessmentInputObjectSchema } from './VendorUpdateWithoutTechnicalAssessmentInput.schema';
import { VendorUncheckedUpdateWithoutTechnicalAssessmentInputObjectSchema as VendorUncheckedUpdateWithoutTechnicalAssessmentInputObjectSchema } from './VendorUncheckedUpdateWithoutTechnicalAssessmentInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => VendorCreateWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => VendorCreateOrConnectWithoutTechnicalAssessmentInputObjectSchema).optional(),
  upsert: z.lazy(() => VendorUpsertWithoutTechnicalAssessmentInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => VendorWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => VendorWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => VendorWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => VendorUpdateToOneWithWhereWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => VendorUpdateWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutTechnicalAssessmentInputObjectSchema)]).optional()
}).strict();
export const VendorUpdateOneWithoutTechnicalAssessmentNestedInputObjectSchema: z.ZodType<Prisma.VendorUpdateOneWithoutTechnicalAssessmentNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpdateOneWithoutTechnicalAssessmentNestedInput>;
export const VendorUpdateOneWithoutTechnicalAssessmentNestedInputObjectZodSchema = makeSchema();
