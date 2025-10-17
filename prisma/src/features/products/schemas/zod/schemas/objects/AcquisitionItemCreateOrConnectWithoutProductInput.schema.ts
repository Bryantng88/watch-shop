import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemCreateWithoutProductInputObjectSchema as AcquisitionItemCreateWithoutProductInputObjectSchema } from './AcquisitionItemCreateWithoutProductInput.schema';
import { AcquisitionItemUncheckedCreateWithoutProductInputObjectSchema as AcquisitionItemUncheckedCreateWithoutProductInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutProductInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const AcquisitionItemCreateOrConnectWithoutProductInputObjectSchema: z.ZodType<Prisma.AcquisitionItemCreateOrConnectWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemCreateOrConnectWithoutProductInput>;
export const AcquisitionItemCreateOrConnectWithoutProductInputObjectZodSchema = makeSchema();
