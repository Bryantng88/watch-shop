import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobWhereUniqueInputObjectSchema as AcquisitionSpecJobWhereUniqueInputObjectSchema } from './AcquisitionSpecJobWhereUniqueInput.schema';
import { AcquisitionSpecJobUpdateWithoutProductInputObjectSchema as AcquisitionSpecJobUpdateWithoutProductInputObjectSchema } from './AcquisitionSpecJobUpdateWithoutProductInput.schema';
import { AcquisitionSpecJobUncheckedUpdateWithoutProductInputObjectSchema as AcquisitionSpecJobUncheckedUpdateWithoutProductInputObjectSchema } from './AcquisitionSpecJobUncheckedUpdateWithoutProductInput.schema';
import { AcquisitionSpecJobCreateWithoutProductInputObjectSchema as AcquisitionSpecJobCreateWithoutProductInputObjectSchema } from './AcquisitionSpecJobCreateWithoutProductInput.schema';
import { AcquisitionSpecJobUncheckedCreateWithoutProductInputObjectSchema as AcquisitionSpecJobUncheckedCreateWithoutProductInputObjectSchema } from './AcquisitionSpecJobUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionSpecJobWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => AcquisitionSpecJobUpdateWithoutProductInputObjectSchema), z.lazy(() => AcquisitionSpecJobUncheckedUpdateWithoutProductInputObjectSchema)]),
  create: z.union([z.lazy(() => AcquisitionSpecJobCreateWithoutProductInputObjectSchema), z.lazy(() => AcquisitionSpecJobUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const AcquisitionSpecJobUpsertWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobUpsertWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobUpsertWithWhereUniqueWithoutProductInput>;
export const AcquisitionSpecJobUpsertWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();
