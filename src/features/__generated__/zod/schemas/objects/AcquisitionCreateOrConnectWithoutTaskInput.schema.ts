import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './AcquisitionWhereUniqueInput.schema';
import { AcquisitionCreateWithoutTaskInputObjectSchema as AcquisitionCreateWithoutTaskInputObjectSchema } from './AcquisitionCreateWithoutTaskInput.schema';
import { AcquisitionUncheckedCreateWithoutTaskInputObjectSchema as AcquisitionUncheckedCreateWithoutTaskInputObjectSchema } from './AcquisitionUncheckedCreateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcquisitionCreateWithoutTaskInputObjectSchema), z.lazy(() => AcquisitionUncheckedCreateWithoutTaskInputObjectSchema)])
}).strict();
export const AcquisitionCreateOrConnectWithoutTaskInputObjectSchema: z.ZodType<Prisma.AcquisitionCreateOrConnectWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionCreateOrConnectWithoutTaskInput>;
export const AcquisitionCreateOrConnectWithoutTaskInputObjectZodSchema = makeSchema();
