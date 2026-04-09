import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobWhereUniqueInputObjectSchema as AcquisitionSpecJobWhereUniqueInputObjectSchema } from './AcquisitionSpecJobWhereUniqueInput.schema';
import { AcquisitionSpecJobUpdateWithoutProductInputObjectSchema as AcquisitionSpecJobUpdateWithoutProductInputObjectSchema } from './AcquisitionSpecJobUpdateWithoutProductInput.schema';
import { AcquisitionSpecJobUncheckedUpdateWithoutProductInputObjectSchema as AcquisitionSpecJobUncheckedUpdateWithoutProductInputObjectSchema } from './AcquisitionSpecJobUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionSpecJobWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => AcquisitionSpecJobUpdateWithoutProductInputObjectSchema), z.lazy(() => AcquisitionSpecJobUncheckedUpdateWithoutProductInputObjectSchema)])
}).strict();
export const AcquisitionSpecJobUpdateWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobUpdateWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobUpdateWithWhereUniqueWithoutProductInput>;
export const AcquisitionSpecJobUpdateWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();
