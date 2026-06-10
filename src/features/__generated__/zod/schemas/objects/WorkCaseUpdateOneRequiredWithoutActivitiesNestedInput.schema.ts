import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCreateWithoutActivitiesInputObjectSchema as WorkCaseCreateWithoutActivitiesInputObjectSchema } from './WorkCaseCreateWithoutActivitiesInput.schema';
import { WorkCaseUncheckedCreateWithoutActivitiesInputObjectSchema as WorkCaseUncheckedCreateWithoutActivitiesInputObjectSchema } from './WorkCaseUncheckedCreateWithoutActivitiesInput.schema';
import { WorkCaseCreateOrConnectWithoutActivitiesInputObjectSchema as WorkCaseCreateOrConnectWithoutActivitiesInputObjectSchema } from './WorkCaseCreateOrConnectWithoutActivitiesInput.schema';
import { WorkCaseUpsertWithoutActivitiesInputObjectSchema as WorkCaseUpsertWithoutActivitiesInputObjectSchema } from './WorkCaseUpsertWithoutActivitiesInput.schema';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseUpdateToOneWithWhereWithoutActivitiesInputObjectSchema as WorkCaseUpdateToOneWithWhereWithoutActivitiesInputObjectSchema } from './WorkCaseUpdateToOneWithWhereWithoutActivitiesInput.schema';
import { WorkCaseUpdateWithoutActivitiesInputObjectSchema as WorkCaseUpdateWithoutActivitiesInputObjectSchema } from './WorkCaseUpdateWithoutActivitiesInput.schema';
import { WorkCaseUncheckedUpdateWithoutActivitiesInputObjectSchema as WorkCaseUncheckedUpdateWithoutActivitiesInputObjectSchema } from './WorkCaseUncheckedUpdateWithoutActivitiesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkCaseCreateWithoutActivitiesInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutActivitiesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WorkCaseCreateOrConnectWithoutActivitiesInputObjectSchema).optional(),
  upsert: z.lazy(() => WorkCaseUpsertWithoutActivitiesInputObjectSchema).optional(),
  connect: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WorkCaseUpdateToOneWithWhereWithoutActivitiesInputObjectSchema), z.lazy(() => WorkCaseUpdateWithoutActivitiesInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateWithoutActivitiesInputObjectSchema)]).optional()
}).strict();
export const WorkCaseUpdateOneRequiredWithoutActivitiesNestedInputObjectSchema: z.ZodType<Prisma.WorkCaseUpdateOneRequiredWithoutActivitiesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpdateOneRequiredWithoutActivitiesNestedInput>;
export const WorkCaseUpdateOneRequiredWithoutActivitiesNestedInputObjectZodSchema = makeSchema();
