import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentScalarWhereInputObjectSchema as TechnicalAssessmentScalarWhereInputObjectSchema } from './TechnicalAssessmentScalarWhereInput.schema';
import { TechnicalAssessmentUpdateManyMutationInputObjectSchema as TechnicalAssessmentUpdateManyMutationInputObjectSchema } from './TechnicalAssessmentUpdateManyMutationInput.schema';
import { TechnicalAssessmentUncheckedUpdateManyWithoutVendorInputObjectSchema as TechnicalAssessmentUncheckedUpdateManyWithoutVendorInputObjectSchema } from './TechnicalAssessmentUncheckedUpdateManyWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalAssessmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TechnicalAssessmentUpdateManyMutationInputObjectSchema), z.lazy(() => TechnicalAssessmentUncheckedUpdateManyWithoutVendorInputObjectSchema)])
}).strict();
export const TechnicalAssessmentUpdateManyWithWhereWithoutVendorInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentUpdateManyWithWhereWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentUpdateManyWithWhereWithoutVendorInput>;
export const TechnicalAssessmentUpdateManyWithWhereWithoutVendorInputObjectZodSchema = makeSchema();
