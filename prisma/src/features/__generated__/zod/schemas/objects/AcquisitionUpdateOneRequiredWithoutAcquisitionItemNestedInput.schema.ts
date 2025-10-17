import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionCreateWithoutAcquisitionItemInputObjectSchema as AcquisitionCreateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionCreateWithoutAcquisitionItemInput.schema';
import { AcquisitionUncheckedCreateWithoutAcquisitionItemInputObjectSchema as AcquisitionUncheckedCreateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionUncheckedCreateWithoutAcquisitionItemInput.schema';
import { AcquisitionCreateOrConnectWithoutAcquisitionItemInputObjectSchema as AcquisitionCreateOrConnectWithoutAcquisitionItemInputObjectSchema } from './AcquisitionCreateOrConnectWithoutAcquisitionItemInput.schema';
import { AcquisitionUpsertWithoutAcquisitionItemInputObjectSchema as AcquisitionUpsertWithoutAcquisitionItemInputObjectSchema } from './AcquisitionUpsertWithoutAcquisitionItemInput.schema';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './AcquisitionWhereUniqueInput.schema';
import { AcquisitionUpdateToOneWithWhereWithoutAcquisitionItemInputObjectSchema as AcquisitionUpdateToOneWithWhereWithoutAcquisitionItemInputObjectSchema } from './AcquisitionUpdateToOneWithWhereWithoutAcquisitionItemInput.schema';
import { AcquisitionUpdateWithoutAcquisitionItemInputObjectSchema as AcquisitionUpdateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionUpdateWithoutAcquisitionItemInput.schema';
import { AcquisitionUncheckedUpdateWithoutAcquisitionItemInputObjectSchema as AcquisitionUncheckedUpdateWithoutAcquisitionItemInputObjectSchema } from './AcquisitionUncheckedUpdateWithoutAcquisitionItemInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionCreateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => AcquisitionUncheckedCreateWithoutAcquisitionItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcquisitionCreateOrConnectWithoutAcquisitionItemInputObjectSchema).optional(),
  upsert: z.lazy(() => AcquisitionUpsertWithoutAcquisitionItemInputObjectSchema).optional(),
  connect: z.lazy(() => AcquisitionWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => AcquisitionUpdateToOneWithWhereWithoutAcquisitionItemInputObjectSchema), z.lazy(() => AcquisitionUpdateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => AcquisitionUncheckedUpdateWithoutAcquisitionItemInputObjectSchema)]).optional()
}).strict();
export const AcquisitionUpdateOneRequiredWithoutAcquisitionItemNestedInputObjectSchema: z.ZodType<Prisma.AcquisitionUpdateOneRequiredWithoutAcquisitionItemNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUpdateOneRequiredWithoutAcquisitionItemNestedInput>;
export const AcquisitionUpdateOneRequiredWithoutAcquisitionItemNestedInputObjectZodSchema = makeSchema();
