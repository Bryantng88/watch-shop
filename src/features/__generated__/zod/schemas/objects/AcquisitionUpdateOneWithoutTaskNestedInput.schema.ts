import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionCreateWithoutTaskInputObjectSchema as AcquisitionCreateWithoutTaskInputObjectSchema } from './AcquisitionCreateWithoutTaskInput.schema';
import { AcquisitionUncheckedCreateWithoutTaskInputObjectSchema as AcquisitionUncheckedCreateWithoutTaskInputObjectSchema } from './AcquisitionUncheckedCreateWithoutTaskInput.schema';
import { AcquisitionCreateOrConnectWithoutTaskInputObjectSchema as AcquisitionCreateOrConnectWithoutTaskInputObjectSchema } from './AcquisitionCreateOrConnectWithoutTaskInput.schema';
import { AcquisitionUpsertWithoutTaskInputObjectSchema as AcquisitionUpsertWithoutTaskInputObjectSchema } from './AcquisitionUpsertWithoutTaskInput.schema';
import { AcquisitionWhereInputObjectSchema as AcquisitionWhereInputObjectSchema } from './AcquisitionWhereInput.schema';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './AcquisitionWhereUniqueInput.schema';
import { AcquisitionUpdateToOneWithWhereWithoutTaskInputObjectSchema as AcquisitionUpdateToOneWithWhereWithoutTaskInputObjectSchema } from './AcquisitionUpdateToOneWithWhereWithoutTaskInput.schema';
import { AcquisitionUpdateWithoutTaskInputObjectSchema as AcquisitionUpdateWithoutTaskInputObjectSchema } from './AcquisitionUpdateWithoutTaskInput.schema';
import { AcquisitionUncheckedUpdateWithoutTaskInputObjectSchema as AcquisitionUncheckedUpdateWithoutTaskInputObjectSchema } from './AcquisitionUncheckedUpdateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionCreateWithoutTaskInputObjectSchema), z.lazy(() => AcquisitionUncheckedCreateWithoutTaskInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcquisitionCreateOrConnectWithoutTaskInputObjectSchema).optional(),
  upsert: z.lazy(() => AcquisitionUpsertWithoutTaskInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => AcquisitionWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => AcquisitionWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => AcquisitionWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => AcquisitionUpdateToOneWithWhereWithoutTaskInputObjectSchema), z.lazy(() => AcquisitionUpdateWithoutTaskInputObjectSchema), z.lazy(() => AcquisitionUncheckedUpdateWithoutTaskInputObjectSchema)]).optional()
}).strict();
export const AcquisitionUpdateOneWithoutTaskNestedInputObjectSchema: z.ZodType<Prisma.AcquisitionUpdateOneWithoutTaskNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUpdateOneWithoutTaskNestedInput>;
export const AcquisitionUpdateOneWithoutTaskNestedInputObjectZodSchema = makeSchema();
