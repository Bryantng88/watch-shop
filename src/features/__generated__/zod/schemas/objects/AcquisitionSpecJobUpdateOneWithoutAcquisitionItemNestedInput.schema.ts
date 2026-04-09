import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobCreateWithoutAcquisitionItemInputObjectSchema as AcquisitionSpecJobCreateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionSpecJobCreateWithoutAcquisitionItemInput.schema';
import { AcquisitionSpecJobUncheckedCreateWithoutAcquisitionItemInputObjectSchema as AcquisitionSpecJobUncheckedCreateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionSpecJobUncheckedCreateWithoutAcquisitionItemInput.schema';
import { AcquisitionSpecJobCreateOrConnectWithoutAcquisitionItemInputObjectSchema as AcquisitionSpecJobCreateOrConnectWithoutAcquisitionItemInputObjectSchema } from './AcquisitionSpecJobCreateOrConnectWithoutAcquisitionItemInput.schema';
import { AcquisitionSpecJobUpsertWithoutAcquisitionItemInputObjectSchema as AcquisitionSpecJobUpsertWithoutAcquisitionItemInputObjectSchema } from './AcquisitionSpecJobUpsertWithoutAcquisitionItemInput.schema';
import { AcquisitionSpecJobWhereInputObjectSchema as AcquisitionSpecJobWhereInputObjectSchema } from './AcquisitionSpecJobWhereInput.schema';
import { AcquisitionSpecJobWhereUniqueInputObjectSchema as AcquisitionSpecJobWhereUniqueInputObjectSchema } from './AcquisitionSpecJobWhereUniqueInput.schema';
import { AcquisitionSpecJobUpdateToOneWithWhereWithoutAcquisitionItemInputObjectSchema as AcquisitionSpecJobUpdateToOneWithWhereWithoutAcquisitionItemInputObjectSchema } from './AcquisitionSpecJobUpdateToOneWithWhereWithoutAcquisitionItemInput.schema';
import { AcquisitionSpecJobUpdateWithoutAcquisitionItemInputObjectSchema as AcquisitionSpecJobUpdateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionSpecJobUpdateWithoutAcquisitionItemInput.schema';
import { AcquisitionSpecJobUncheckedUpdateWithoutAcquisitionItemInputObjectSchema as AcquisitionSpecJobUncheckedUpdateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionSpecJobUncheckedUpdateWithoutAcquisitionItemInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionSpecJobCreateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => AcquisitionSpecJobUncheckedCreateWithoutAcquisitionItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcquisitionSpecJobCreateOrConnectWithoutAcquisitionItemInputObjectSchema).optional(),
  upsert: z.lazy(() => AcquisitionSpecJobUpsertWithoutAcquisitionItemInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => AcquisitionSpecJobWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => AcquisitionSpecJobWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => AcquisitionSpecJobWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => AcquisitionSpecJobUpdateToOneWithWhereWithoutAcquisitionItemInputObjectSchema), z.lazy(() => AcquisitionSpecJobUpdateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => AcquisitionSpecJobUncheckedUpdateWithoutAcquisitionItemInputObjectSchema)]).optional()
}).strict();
export const AcquisitionSpecJobUpdateOneWithoutAcquisitionItemNestedInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobUpdateOneWithoutAcquisitionItemNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobUpdateOneWithoutAcquisitionItemNestedInput>;
export const AcquisitionSpecJobUpdateOneWithoutAcquisitionItemNestedInputObjectZodSchema = makeSchema();
