import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionCreateWithoutTaskInputObjectSchema as AcquisitionCreateWithoutTaskInputObjectSchema } from './AcquisitionCreateWithoutTaskInput.schema';
import { AcquisitionUncheckedCreateWithoutTaskInputObjectSchema as AcquisitionUncheckedCreateWithoutTaskInputObjectSchema } from './AcquisitionUncheckedCreateWithoutTaskInput.schema';
import { AcquisitionCreateOrConnectWithoutTaskInputObjectSchema as AcquisitionCreateOrConnectWithoutTaskInputObjectSchema } from './AcquisitionCreateOrConnectWithoutTaskInput.schema';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './AcquisitionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionCreateWithoutTaskInputObjectSchema), z.lazy(() => AcquisitionUncheckedCreateWithoutTaskInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcquisitionCreateOrConnectWithoutTaskInputObjectSchema).optional(),
  connect: z.lazy(() => AcquisitionWhereUniqueInputObjectSchema).optional()
}).strict();
export const AcquisitionCreateNestedOneWithoutTaskInputObjectSchema: z.ZodType<Prisma.AcquisitionCreateNestedOneWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionCreateNestedOneWithoutTaskInput>;
export const AcquisitionCreateNestedOneWithoutTaskInputObjectZodSchema = makeSchema();
