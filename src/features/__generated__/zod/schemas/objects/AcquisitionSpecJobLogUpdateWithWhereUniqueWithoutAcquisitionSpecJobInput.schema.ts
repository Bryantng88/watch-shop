import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobLogWhereUniqueInputObjectSchema as AcquisitionSpecJobLogWhereUniqueInputObjectSchema } from './AcquisitionSpecJobLogWhereUniqueInput.schema';
import { AcquisitionSpecJobLogUpdateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionSpecJobLogUpdateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionSpecJobLogUpdateWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionSpecJobLogUncheckedUpdateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionSpecJobLogUncheckedUpdateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionSpecJobLogUncheckedUpdateWithoutAcquisitionSpecJobInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionSpecJobLogWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => AcquisitionSpecJobLogUpdateWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogUncheckedUpdateWithoutAcquisitionSpecJobInputObjectSchema)])
}).strict();
export const AcquisitionSpecJobLogUpdateWithWhereUniqueWithoutAcquisitionSpecJobInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobLogUpdateWithWhereUniqueWithoutAcquisitionSpecJobInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogUpdateWithWhereUniqueWithoutAcquisitionSpecJobInput>;
export const AcquisitionSpecJobLogUpdateWithWhereUniqueWithoutAcquisitionSpecJobInputObjectZodSchema = makeSchema();
