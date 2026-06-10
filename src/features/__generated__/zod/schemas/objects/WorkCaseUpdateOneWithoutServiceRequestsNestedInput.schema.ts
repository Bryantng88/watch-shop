import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCreateWithoutServiceRequestsInputObjectSchema as WorkCaseCreateWithoutServiceRequestsInputObjectSchema } from './WorkCaseCreateWithoutServiceRequestsInput.schema';
import { WorkCaseUncheckedCreateWithoutServiceRequestsInputObjectSchema as WorkCaseUncheckedCreateWithoutServiceRequestsInputObjectSchema } from './WorkCaseUncheckedCreateWithoutServiceRequestsInput.schema';
import { WorkCaseCreateOrConnectWithoutServiceRequestsInputObjectSchema as WorkCaseCreateOrConnectWithoutServiceRequestsInputObjectSchema } from './WorkCaseCreateOrConnectWithoutServiceRequestsInput.schema';
import { WorkCaseUpsertWithoutServiceRequestsInputObjectSchema as WorkCaseUpsertWithoutServiceRequestsInputObjectSchema } from './WorkCaseUpsertWithoutServiceRequestsInput.schema';
import { WorkCaseWhereInputObjectSchema as WorkCaseWhereInputObjectSchema } from './WorkCaseWhereInput.schema';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseUpdateToOneWithWhereWithoutServiceRequestsInputObjectSchema as WorkCaseUpdateToOneWithWhereWithoutServiceRequestsInputObjectSchema } from './WorkCaseUpdateToOneWithWhereWithoutServiceRequestsInput.schema';
import { WorkCaseUpdateWithoutServiceRequestsInputObjectSchema as WorkCaseUpdateWithoutServiceRequestsInputObjectSchema } from './WorkCaseUpdateWithoutServiceRequestsInput.schema';
import { WorkCaseUncheckedUpdateWithoutServiceRequestsInputObjectSchema as WorkCaseUncheckedUpdateWithoutServiceRequestsInputObjectSchema } from './WorkCaseUncheckedUpdateWithoutServiceRequestsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkCaseCreateWithoutServiceRequestsInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutServiceRequestsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WorkCaseCreateOrConnectWithoutServiceRequestsInputObjectSchema).optional(),
  upsert: z.lazy(() => WorkCaseUpsertWithoutServiceRequestsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => WorkCaseWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => WorkCaseWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WorkCaseUpdateToOneWithWhereWithoutServiceRequestsInputObjectSchema), z.lazy(() => WorkCaseUpdateWithoutServiceRequestsInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateWithoutServiceRequestsInputObjectSchema)]).optional()
}).strict();
export const WorkCaseUpdateOneWithoutServiceRequestsNestedInputObjectSchema: z.ZodType<Prisma.WorkCaseUpdateOneWithoutServiceRequestsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpdateOneWithoutServiceRequestsNestedInput>;
export const WorkCaseUpdateOneWithoutServiceRequestsNestedInputObjectZodSchema = makeSchema();
