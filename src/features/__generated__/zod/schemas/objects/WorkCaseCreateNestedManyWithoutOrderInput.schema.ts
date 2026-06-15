import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCreateWithoutOrderInputObjectSchema as WorkCaseCreateWithoutOrderInputObjectSchema } from './WorkCaseCreateWithoutOrderInput.schema';
import { WorkCaseUncheckedCreateWithoutOrderInputObjectSchema as WorkCaseUncheckedCreateWithoutOrderInputObjectSchema } from './WorkCaseUncheckedCreateWithoutOrderInput.schema';
import { WorkCaseCreateOrConnectWithoutOrderInputObjectSchema as WorkCaseCreateOrConnectWithoutOrderInputObjectSchema } from './WorkCaseCreateOrConnectWithoutOrderInput.schema';
import { WorkCaseCreateManyOrderInputEnvelopeObjectSchema as WorkCaseCreateManyOrderInputEnvelopeObjectSchema } from './WorkCaseCreateManyOrderInputEnvelope.schema';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkCaseCreateWithoutOrderInputObjectSchema), z.lazy(() => WorkCaseCreateWithoutOrderInputObjectSchema).array(), z.lazy(() => WorkCaseUncheckedCreateWithoutOrderInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutOrderInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkCaseCreateOrConnectWithoutOrderInputObjectSchema), z.lazy(() => WorkCaseCreateOrConnectWithoutOrderInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkCaseCreateManyOrderInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => WorkCaseWhereUniqueInputObjectSchema), z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const WorkCaseCreateNestedManyWithoutOrderInputObjectSchema: z.ZodType<Prisma.WorkCaseCreateNestedManyWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCreateNestedManyWithoutOrderInput>;
export const WorkCaseCreateNestedManyWithoutOrderInputObjectZodSchema = makeSchema();
