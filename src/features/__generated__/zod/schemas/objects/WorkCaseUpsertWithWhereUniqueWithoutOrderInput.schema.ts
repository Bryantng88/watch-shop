import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseUpdateWithoutOrderInputObjectSchema as WorkCaseUpdateWithoutOrderInputObjectSchema } from './WorkCaseUpdateWithoutOrderInput.schema';
import { WorkCaseUncheckedUpdateWithoutOrderInputObjectSchema as WorkCaseUncheckedUpdateWithoutOrderInputObjectSchema } from './WorkCaseUncheckedUpdateWithoutOrderInput.schema';
import { WorkCaseCreateWithoutOrderInputObjectSchema as WorkCaseCreateWithoutOrderInputObjectSchema } from './WorkCaseCreateWithoutOrderInput.schema';
import { WorkCaseUncheckedCreateWithoutOrderInputObjectSchema as WorkCaseUncheckedCreateWithoutOrderInputObjectSchema } from './WorkCaseUncheckedCreateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => WorkCaseUpdateWithoutOrderInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateWithoutOrderInputObjectSchema)]),
  create: z.union([z.lazy(() => WorkCaseCreateWithoutOrderInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutOrderInputObjectSchema)])
}).strict();
export const WorkCaseUpsertWithWhereUniqueWithoutOrderInputObjectSchema: z.ZodType<Prisma.WorkCaseUpsertWithWhereUniqueWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpsertWithWhereUniqueWithoutOrderInput>;
export const WorkCaseUpsertWithWhereUniqueWithoutOrderInputObjectZodSchema = makeSchema();
