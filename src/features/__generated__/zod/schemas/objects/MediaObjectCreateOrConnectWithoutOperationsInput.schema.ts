import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaObjectWhereUniqueInputObjectSchema as MediaObjectWhereUniqueInputObjectSchema } from './MediaObjectWhereUniqueInput.schema';
import { MediaObjectCreateWithoutOperationsInputObjectSchema as MediaObjectCreateWithoutOperationsInputObjectSchema } from './MediaObjectCreateWithoutOperationsInput.schema';
import { MediaObjectUncheckedCreateWithoutOperationsInputObjectSchema as MediaObjectUncheckedCreateWithoutOperationsInputObjectSchema } from './MediaObjectUncheckedCreateWithoutOperationsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MediaObjectWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MediaObjectCreateWithoutOperationsInputObjectSchema), z.lazy(() => MediaObjectUncheckedCreateWithoutOperationsInputObjectSchema)])
}).strict();
export const MediaObjectCreateOrConnectWithoutOperationsInputObjectSchema: z.ZodType<Prisma.MediaObjectCreateOrConnectWithoutOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectCreateOrConnectWithoutOperationsInput>;
export const MediaObjectCreateOrConnectWithoutOperationsInputObjectZodSchema = makeSchema();
