import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobScalarWhereInputObjectSchema as AcquisitionSpecJobScalarWhereInputObjectSchema } from './AcquisitionSpecJobScalarWhereInput.schema';
import { AcquisitionSpecJobUpdateManyMutationInputObjectSchema as AcquisitionSpecJobUpdateManyMutationInputObjectSchema } from './AcquisitionSpecJobUpdateManyMutationInput.schema';
import { AcquisitionSpecJobUncheckedUpdateManyWithoutProductInputObjectSchema as AcquisitionSpecJobUncheckedUpdateManyWithoutProductInputObjectSchema } from './AcquisitionSpecJobUncheckedUpdateManyWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionSpecJobScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => AcquisitionSpecJobUpdateManyMutationInputObjectSchema), z.lazy(() => AcquisitionSpecJobUncheckedUpdateManyWithoutProductInputObjectSchema)])
}).strict();
export const AcquisitionSpecJobUpdateManyWithWhereWithoutProductInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobUpdateManyWithWhereWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobUpdateManyWithWhereWithoutProductInput>;
export const AcquisitionSpecJobUpdateManyWithWhereWithoutProductInputObjectZodSchema = makeSchema();
