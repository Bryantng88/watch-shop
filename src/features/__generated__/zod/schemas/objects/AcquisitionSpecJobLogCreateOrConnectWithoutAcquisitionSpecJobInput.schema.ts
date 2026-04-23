import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobLogWhereUniqueInputObjectSchema as AcquisitionSpecJobLogWhereUniqueInputObjectSchema } from './AcquisitionSpecJobLogWhereUniqueInput.schema';
import { AcquisitionSpecJobLogCreateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionSpecJobLogCreateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionSpecJobLogCreateWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionSpecJobLogUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionSpecJobLogUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionSpecJobLogUncheckedCreateWithoutAcquisitionSpecJobInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionSpecJobLogWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcquisitionSpecJobLogCreateWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema)])
}).strict();
export const AcquisitionSpecJobLogCreateOrConnectWithoutAcquisitionSpecJobInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobLogCreateOrConnectWithoutAcquisitionSpecJobInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogCreateOrConnectWithoutAcquisitionSpecJobInput>;
export const AcquisitionSpecJobLogCreateOrConnectWithoutAcquisitionSpecJobInputObjectZodSchema = makeSchema();
