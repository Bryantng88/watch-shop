import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseCreateWithoutShipmentInputObjectSchema as WorkCaseCreateWithoutShipmentInputObjectSchema } from './WorkCaseCreateWithoutShipmentInput.schema';
import { WorkCaseUncheckedCreateWithoutShipmentInputObjectSchema as WorkCaseUncheckedCreateWithoutShipmentInputObjectSchema } from './WorkCaseUncheckedCreateWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WorkCaseCreateWithoutShipmentInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutShipmentInputObjectSchema)])
}).strict();
export const WorkCaseCreateOrConnectWithoutShipmentInputObjectSchema: z.ZodType<Prisma.WorkCaseCreateOrConnectWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCreateOrConnectWithoutShipmentInput>;
export const WorkCaseCreateOrConnectWithoutShipmentInputObjectZodSchema = makeSchema();
