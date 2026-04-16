import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemCreateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionItemCreateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionItemCreateWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionItemUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionItemUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionItemCreateOrConnectWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionItemCreateOrConnectWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionItemCreateOrConnectWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcquisitionItemCreateOrConnectWithoutAcquisitionSpecJobInputObjectSchema).optional(),
  connect: z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).optional()
}).strict();
export const AcquisitionItemCreateNestedOneWithoutAcquisitionSpecJobInputObjectSchema: z.ZodType<Prisma.AcquisitionItemCreateNestedOneWithoutAcquisitionSpecJobInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemCreateNestedOneWithoutAcquisitionSpecJobInput>;
export const AcquisitionItemCreateNestedOneWithoutAcquisitionSpecJobInputObjectZodSchema = makeSchema();
