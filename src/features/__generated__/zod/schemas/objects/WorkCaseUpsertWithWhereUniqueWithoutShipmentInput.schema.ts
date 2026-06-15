import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseUpdateWithoutShipmentInputObjectSchema as WorkCaseUpdateWithoutShipmentInputObjectSchema } from './WorkCaseUpdateWithoutShipmentInput.schema';
import { WorkCaseUncheckedUpdateWithoutShipmentInputObjectSchema as WorkCaseUncheckedUpdateWithoutShipmentInputObjectSchema } from './WorkCaseUncheckedUpdateWithoutShipmentInput.schema';
import { WorkCaseCreateWithoutShipmentInputObjectSchema as WorkCaseCreateWithoutShipmentInputObjectSchema } from './WorkCaseCreateWithoutShipmentInput.schema';
import { WorkCaseUncheckedCreateWithoutShipmentInputObjectSchema as WorkCaseUncheckedCreateWithoutShipmentInputObjectSchema } from './WorkCaseUncheckedCreateWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => WorkCaseUpdateWithoutShipmentInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateWithoutShipmentInputObjectSchema)]),
  create: z.union([z.lazy(() => WorkCaseCreateWithoutShipmentInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutShipmentInputObjectSchema)])
}).strict();
export const WorkCaseUpsertWithWhereUniqueWithoutShipmentInputObjectSchema: z.ZodType<Prisma.WorkCaseUpsertWithWhereUniqueWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpsertWithWhereUniqueWithoutShipmentInput>;
export const WorkCaseUpsertWithWhereUniqueWithoutShipmentInputObjectZodSchema = makeSchema();
