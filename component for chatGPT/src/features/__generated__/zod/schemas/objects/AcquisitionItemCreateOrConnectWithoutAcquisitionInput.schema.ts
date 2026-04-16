import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemCreateWithoutAcquisitionInputObjectSchema as AcquisitionItemCreateWithoutAcquisitionInputObjectSchema } from './AcquisitionItemCreateWithoutAcquisitionInput.schema';
import { AcquisitionItemUncheckedCreateWithoutAcquisitionInputObjectSchema as AcquisitionItemUncheckedCreateWithoutAcquisitionInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutAcquisitionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutAcquisitionInputObjectSchema)])
}).strict();
export const AcquisitionItemCreateOrConnectWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.AcquisitionItemCreateOrConnectWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemCreateOrConnectWithoutAcquisitionInput>;
export const AcquisitionItemCreateOrConnectWithoutAcquisitionInputObjectZodSchema = makeSchema();
