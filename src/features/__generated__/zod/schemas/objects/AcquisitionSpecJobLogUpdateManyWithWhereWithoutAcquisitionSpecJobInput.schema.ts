import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobLogScalarWhereInputObjectSchema as AcquisitionSpecJobLogScalarWhereInputObjectSchema } from './AcquisitionSpecJobLogScalarWhereInput.schema';
import { AcquisitionSpecJobLogUpdateManyMutationInputObjectSchema as AcquisitionSpecJobLogUpdateManyMutationInputObjectSchema } from './AcquisitionSpecJobLogUpdateManyMutationInput.schema';
import { AcquisitionSpecJobLogUncheckedUpdateManyWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionSpecJobLogUncheckedUpdateManyWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionSpecJobLogUncheckedUpdateManyWithoutAcquisitionSpecJobInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionSpecJobLogScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => AcquisitionSpecJobLogUpdateManyMutationInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogUncheckedUpdateManyWithoutAcquisitionSpecJobInputObjectSchema)])
}).strict();
export const AcquisitionSpecJobLogUpdateManyWithWhereWithoutAcquisitionSpecJobInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobLogUpdateManyWithWhereWithoutAcquisitionSpecJobInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogUpdateManyWithWhereWithoutAcquisitionSpecJobInput>;
export const AcquisitionSpecJobLogUpdateManyWithWhereWithoutAcquisitionSpecJobInputObjectZodSchema = makeSchema();
