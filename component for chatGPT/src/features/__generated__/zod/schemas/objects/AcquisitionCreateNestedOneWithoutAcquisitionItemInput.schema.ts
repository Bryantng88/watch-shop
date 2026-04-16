import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionCreateWithoutAcquisitionItemInputObjectSchema as AcquisitionCreateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionCreateWithoutAcquisitionItemInput.schema';
import { AcquisitionUncheckedCreateWithoutAcquisitionItemInputObjectSchema as AcquisitionUncheckedCreateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionUncheckedCreateWithoutAcquisitionItemInput.schema';
import { AcquisitionCreateOrConnectWithoutAcquisitionItemInputObjectSchema as AcquisitionCreateOrConnectWithoutAcquisitionItemInputObjectSchema } from './AcquisitionCreateOrConnectWithoutAcquisitionItemInput.schema';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './AcquisitionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionCreateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => AcquisitionUncheckedCreateWithoutAcquisitionItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcquisitionCreateOrConnectWithoutAcquisitionItemInputObjectSchema).optional(),
  connect: z.lazy(() => AcquisitionWhereUniqueInputObjectSchema).optional()
}).strict();
export const AcquisitionCreateNestedOneWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.AcquisitionCreateNestedOneWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionCreateNestedOneWithoutAcquisitionItemInput>;
export const AcquisitionCreateNestedOneWithoutAcquisitionItemInputObjectZodSchema = makeSchema();
