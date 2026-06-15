import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCreateWithoutShipmentInputObjectSchema as WorkCaseCreateWithoutShipmentInputObjectSchema } from './WorkCaseCreateWithoutShipmentInput.schema';
import { WorkCaseUncheckedCreateWithoutShipmentInputObjectSchema as WorkCaseUncheckedCreateWithoutShipmentInputObjectSchema } from './WorkCaseUncheckedCreateWithoutShipmentInput.schema';
import { WorkCaseCreateOrConnectWithoutShipmentInputObjectSchema as WorkCaseCreateOrConnectWithoutShipmentInputObjectSchema } from './WorkCaseCreateOrConnectWithoutShipmentInput.schema';
import { WorkCaseCreateManyShipmentInputEnvelopeObjectSchema as WorkCaseCreateManyShipmentInputEnvelopeObjectSchema } from './WorkCaseCreateManyShipmentInputEnvelope.schema';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkCaseCreateWithoutShipmentInputObjectSchema), z.lazy(() => WorkCaseCreateWithoutShipmentInputObjectSchema).array(), z.lazy(() => WorkCaseUncheckedCreateWithoutShipmentInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutShipmentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkCaseCreateOrConnectWithoutShipmentInputObjectSchema), z.lazy(() => WorkCaseCreateOrConnectWithoutShipmentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkCaseCreateManyShipmentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const WorkCaseUncheckedCreateNestedManyWithoutShipmentInputObjectSchema: z.ZodType<Prisma.WorkCaseUncheckedCreateNestedManyWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUncheckedCreateNestedManyWithoutShipmentInput>;
export const WorkCaseUncheckedCreateNestedManyWithoutShipmentInputObjectZodSchema = makeSchema();
