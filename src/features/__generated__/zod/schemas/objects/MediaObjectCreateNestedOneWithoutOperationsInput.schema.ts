import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaObjectCreateWithoutOperationsInputObjectSchema as MediaObjectCreateWithoutOperationsInputObjectSchema } from './MediaObjectCreateWithoutOperationsInput.schema';
import { MediaObjectUncheckedCreateWithoutOperationsInputObjectSchema as MediaObjectUncheckedCreateWithoutOperationsInputObjectSchema } from './MediaObjectUncheckedCreateWithoutOperationsInput.schema';
import { MediaObjectCreateOrConnectWithoutOperationsInputObjectSchema as MediaObjectCreateOrConnectWithoutOperationsInputObjectSchema } from './MediaObjectCreateOrConnectWithoutOperationsInput.schema';
import { MediaObjectWhereUniqueInputObjectSchema as MediaObjectWhereUniqueInputObjectSchema } from './MediaObjectWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MediaObjectCreateWithoutOperationsInputObjectSchema), z.lazy(() => MediaObjectUncheckedCreateWithoutOperationsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => MediaObjectCreateOrConnectWithoutOperationsInputObjectSchema).optional(),
  connect: z.lazy(() => MediaObjectWhereUniqueInputObjectSchema).optional()
}).strict();
export const MediaObjectCreateNestedOneWithoutOperationsInputObjectSchema: z.ZodType<Prisma.MediaObjectCreateNestedOneWithoutOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectCreateNestedOneWithoutOperationsInput>;
export const MediaObjectCreateNestedOneWithoutOperationsInputObjectZodSchema = makeSchema();
