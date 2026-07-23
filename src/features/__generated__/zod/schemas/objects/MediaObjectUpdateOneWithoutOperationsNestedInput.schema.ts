import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaObjectCreateWithoutOperationsInputObjectSchema as MediaObjectCreateWithoutOperationsInputObjectSchema } from './MediaObjectCreateWithoutOperationsInput.schema';
import { MediaObjectUncheckedCreateWithoutOperationsInputObjectSchema as MediaObjectUncheckedCreateWithoutOperationsInputObjectSchema } from './MediaObjectUncheckedCreateWithoutOperationsInput.schema';
import { MediaObjectCreateOrConnectWithoutOperationsInputObjectSchema as MediaObjectCreateOrConnectWithoutOperationsInputObjectSchema } from './MediaObjectCreateOrConnectWithoutOperationsInput.schema';
import { MediaObjectUpsertWithoutOperationsInputObjectSchema as MediaObjectUpsertWithoutOperationsInputObjectSchema } from './MediaObjectUpsertWithoutOperationsInput.schema';
import { MediaObjectWhereInputObjectSchema as MediaObjectWhereInputObjectSchema } from './MediaObjectWhereInput.schema';
import { MediaObjectWhereUniqueInputObjectSchema as MediaObjectWhereUniqueInputObjectSchema } from './MediaObjectWhereUniqueInput.schema';
import { MediaObjectUpdateToOneWithWhereWithoutOperationsInputObjectSchema as MediaObjectUpdateToOneWithWhereWithoutOperationsInputObjectSchema } from './MediaObjectUpdateToOneWithWhereWithoutOperationsInput.schema';
import { MediaObjectUpdateWithoutOperationsInputObjectSchema as MediaObjectUpdateWithoutOperationsInputObjectSchema } from './MediaObjectUpdateWithoutOperationsInput.schema';
import { MediaObjectUncheckedUpdateWithoutOperationsInputObjectSchema as MediaObjectUncheckedUpdateWithoutOperationsInputObjectSchema } from './MediaObjectUncheckedUpdateWithoutOperationsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MediaObjectCreateWithoutOperationsInputObjectSchema), z.lazy(() => MediaObjectUncheckedCreateWithoutOperationsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => MediaObjectCreateOrConnectWithoutOperationsInputObjectSchema).optional(),
  upsert: z.lazy(() => MediaObjectUpsertWithoutOperationsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => MediaObjectWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => MediaObjectWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => MediaObjectWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => MediaObjectUpdateToOneWithWhereWithoutOperationsInputObjectSchema), z.lazy(() => MediaObjectUpdateWithoutOperationsInputObjectSchema), z.lazy(() => MediaObjectUncheckedUpdateWithoutOperationsInputObjectSchema)]).optional()
}).strict();
export const MediaObjectUpdateOneWithoutOperationsNestedInputObjectSchema: z.ZodType<Prisma.MediaObjectUpdateOneWithoutOperationsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectUpdateOneWithoutOperationsNestedInput>;
export const MediaObjectUpdateOneWithoutOperationsNestedInputObjectZodSchema = makeSchema();
