import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobLogWhereUniqueInputObjectSchema as AcquisitionSpecJobLogWhereUniqueInputObjectSchema } from './AcquisitionSpecJobLogWhereUniqueInput.schema';
import { AcquisitionSpecJobLogUpdateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionSpecJobLogUpdateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionSpecJobLogUpdateWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionSpecJobLogUncheckedUpdateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionSpecJobLogUncheckedUpdateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionSpecJobLogUncheckedUpdateWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionSpecJobLogCreateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionSpecJobLogCreateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionSpecJobLogCreateWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionSpecJobLogUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionSpecJobLogUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionSpecJobLogUncheckedCreateWithoutAcquisitionSpecJobInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionSpecJobLogWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => AcquisitionSpecJobLogUpdateWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogUncheckedUpdateWithoutAcquisitionSpecJobInputObjectSchema)]),
  create: z.union([z.lazy(() => AcquisitionSpecJobLogCreateWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema)])
}).strict();
export const AcquisitionSpecJobLogUpsertWithWhereUniqueWithoutAcquisitionSpecJobInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobLogUpsertWithWhereUniqueWithoutAcquisitionSpecJobInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogUpsertWithWhereUniqueWithoutAcquisitionSpecJobInput>;
export const AcquisitionSpecJobLogUpsertWithWhereUniqueWithoutAcquisitionSpecJobInputObjectZodSchema = makeSchema();
