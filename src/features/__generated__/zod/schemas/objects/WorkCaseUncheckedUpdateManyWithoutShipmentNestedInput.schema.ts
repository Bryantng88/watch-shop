import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCreateWithoutShipmentInputObjectSchema as WorkCaseCreateWithoutShipmentInputObjectSchema } from './WorkCaseCreateWithoutShipmentInput.schema';
import { WorkCaseUncheckedCreateWithoutShipmentInputObjectSchema as WorkCaseUncheckedCreateWithoutShipmentInputObjectSchema } from './WorkCaseUncheckedCreateWithoutShipmentInput.schema';
import { WorkCaseCreateOrConnectWithoutShipmentInputObjectSchema as WorkCaseCreateOrConnectWithoutShipmentInputObjectSchema } from './WorkCaseCreateOrConnectWithoutShipmentInput.schema';
import { WorkCaseUpsertWithWhereUniqueWithoutShipmentInputObjectSchema as WorkCaseUpsertWithWhereUniqueWithoutShipmentInputObjectSchema } from './WorkCaseUpsertWithWhereUniqueWithoutShipmentInput.schema';
import { WorkCaseCreateManyShipmentInputEnvelopeObjectSchema as WorkCaseCreateManyShipmentInputEnvelopeObjectSchema } from './WorkCaseCreateManyShipmentInputEnvelope.schema';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseUpdateWithWhereUniqueWithoutShipmentInputObjectSchema as WorkCaseUpdateWithWhereUniqueWithoutShipmentInputObjectSchema } from './WorkCaseUpdateWithWhereUniqueWithoutShipmentInput.schema';
import { WorkCaseUpdateManyWithWhereWithoutShipmentInputObjectSchema as WorkCaseUpdateManyWithWhereWithoutShipmentInputObjectSchema } from './WorkCaseUpdateManyWithWhereWithoutShipmentInput.schema';
import { WorkCaseScalarWhereInputObjectSchema as WorkCaseScalarWhereInputObjectSchema } from './WorkCaseScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkCaseCreateWithoutShipmentInputObjectSchema), z.lazy(() => WorkCaseCreateWithoutShipmentInputObjectSchema).array(), z.lazy(() => WorkCaseUncheckedCreateWithoutShipmentInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutShipmentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkCaseCreateOrConnectWithoutShipmentInputObjectSchema), z.lazy(() => WorkCaseCreateOrConnectWithoutShipmentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => WorkCaseUpsertWithWhereUniqueWithoutShipmentInputObjectSchema), z.lazy(() => WorkCaseUpsertWithWhereUniqueWithoutShipmentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkCaseCreateManyShipmentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => WorkCaseUpdateWithWhereUniqueWithoutShipmentInputObjectSchema), z.lazy(() => WorkCaseUpdateWithWhereUniqueWithoutShipmentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => WorkCaseUpdateManyWithWhereWithoutShipmentInputObjectSchema), z.lazy(() => WorkCaseUpdateManyWithWhereWithoutShipmentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => WorkCaseScalarWhereInputObjectSchema), z.lazy(() => WorkCaseScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const WorkCaseUncheckedUpdateManyWithoutShipmentNestedInputObjectSchema: z.ZodType<Prisma.WorkCaseUncheckedUpdateManyWithoutShipmentNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUncheckedUpdateManyWithoutShipmentNestedInput>;
export const WorkCaseUncheckedUpdateManyWithoutShipmentNestedInputObjectZodSchema = makeSchema();
