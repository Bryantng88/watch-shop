import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseCreateWithoutOrderInputObjectSchema as WorkCaseCreateWithoutOrderInputObjectSchema } from './WorkCaseCreateWithoutOrderInput.schema';
import { WorkCaseUncheckedCreateWithoutOrderInputObjectSchema as WorkCaseUncheckedCreateWithoutOrderInputObjectSchema } from './WorkCaseUncheckedCreateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WorkCaseCreateWithoutOrderInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutOrderInputObjectSchema)])
}).strict();
export const WorkCaseCreateOrConnectWithoutOrderInputObjectSchema: z.ZodType<Prisma.WorkCaseCreateOrConnectWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCreateOrConnectWithoutOrderInput>;
export const WorkCaseCreateOrConnectWithoutOrderInputObjectZodSchema = makeSchema();
