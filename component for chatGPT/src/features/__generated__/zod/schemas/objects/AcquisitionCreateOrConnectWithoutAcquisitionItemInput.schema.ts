import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './AcquisitionWhereUniqueInput.schema';
import { AcquisitionCreateWithoutAcquisitionItemInputObjectSchema as AcquisitionCreateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionCreateWithoutAcquisitionItemInput.schema';
import { AcquisitionUncheckedCreateWithoutAcquisitionItemInputObjectSchema as AcquisitionUncheckedCreateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionUncheckedCreateWithoutAcquisitionItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcquisitionCreateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => AcquisitionUncheckedCreateWithoutAcquisitionItemInputObjectSchema)])
}).strict();
export const AcquisitionCreateOrConnectWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.AcquisitionCreateOrConnectWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionCreateOrConnectWithoutAcquisitionItemInput>;
export const AcquisitionCreateOrConnectWithoutAcquisitionItemInputObjectZodSchema = makeSchema();
