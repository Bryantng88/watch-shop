import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemCreateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionItemCreateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionItemCreateWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionItemUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionItemUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionItemCreateOrConnectWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionItemCreateOrConnectWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionItemCreateOrConnectWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionItemUpsertWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionItemUpsertWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionItemUpsertWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemUpdateToOneWithWhereWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionItemUpdateToOneWithWhereWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionItemUpdateToOneWithWhereWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionItemUpdateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionItemUpdateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionItemUpdateWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionItemUncheckedUpdateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionItemUncheckedUpdateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionItemUncheckedUpdateWithoutAcquisitionSpecJobInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcquisitionItemCreateOrConnectWithoutAcquisitionSpecJobInputObjectSchema).optional(),
  upsert: z.lazy(() => AcquisitionItemUpsertWithoutAcquisitionSpecJobInputObjectSchema).optional(),
  connect: z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => AcquisitionItemUpdateToOneWithWhereWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => AcquisitionItemUpdateWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedUpdateWithoutAcquisitionSpecJobInputObjectSchema)]).optional()
}).strict();
export const AcquisitionItemUpdateOneRequiredWithoutAcquisitionSpecJobNestedInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUpdateOneRequiredWithoutAcquisitionSpecJobNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUpdateOneRequiredWithoutAcquisitionSpecJobNestedInput>;
export const AcquisitionItemUpdateOneRequiredWithoutAcquisitionSpecJobNestedInputObjectZodSchema = makeSchema();
