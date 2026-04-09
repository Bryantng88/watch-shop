import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemCreateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionItemCreateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionItemCreateWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionItemUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionItemUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutAcquisitionSpecJobInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema)])
}).strict();
export const AcquisitionItemCreateOrConnectWithoutAcquisitionSpecJobInputObjectSchema: z.ZodType<Prisma.AcquisitionItemCreateOrConnectWithoutAcquisitionSpecJobInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemCreateOrConnectWithoutAcquisitionSpecJobInput>;
export const AcquisitionItemCreateOrConnectWithoutAcquisitionSpecJobInputObjectZodSchema = makeSchema();
