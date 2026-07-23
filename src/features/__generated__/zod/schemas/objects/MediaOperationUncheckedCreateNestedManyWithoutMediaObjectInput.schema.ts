import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOperationCreateWithoutMediaObjectInputObjectSchema as MediaOperationCreateWithoutMediaObjectInputObjectSchema } from './MediaOperationCreateWithoutMediaObjectInput.schema';
import { MediaOperationUncheckedCreateWithoutMediaObjectInputObjectSchema as MediaOperationUncheckedCreateWithoutMediaObjectInputObjectSchema } from './MediaOperationUncheckedCreateWithoutMediaObjectInput.schema';
import { MediaOperationCreateOrConnectWithoutMediaObjectInputObjectSchema as MediaOperationCreateOrConnectWithoutMediaObjectInputObjectSchema } from './MediaOperationCreateOrConnectWithoutMediaObjectInput.schema';
import { MediaOperationCreateManyMediaObjectInputEnvelopeObjectSchema as MediaOperationCreateManyMediaObjectInputEnvelopeObjectSchema } from './MediaOperationCreateManyMediaObjectInputEnvelope.schema';
import { MediaOperationWhereUniqueInputObjectSchema as MediaOperationWhereUniqueInputObjectSchema } from './MediaOperationWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MediaOperationCreateWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaOperationCreateWithoutMediaObjectInputObjectSchema).array(), z.lazy(() => MediaOperationUncheckedCreateWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaOperationUncheckedCreateWithoutMediaObjectInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MediaOperationCreateOrConnectWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaOperationCreateOrConnectWithoutMediaObjectInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MediaOperationCreateManyMediaObjectInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => MediaOperationWhereUniqueInputObjectSchema), z.lazy(() => MediaOperationWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const MediaOperationUncheckedCreateNestedManyWithoutMediaObjectInputObjectSchema: z.ZodType<Prisma.MediaOperationUncheckedCreateNestedManyWithoutMediaObjectInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaOperationUncheckedCreateNestedManyWithoutMediaObjectInput>;
export const MediaOperationUncheckedCreateNestedManyWithoutMediaObjectInputObjectZodSchema = makeSchema();
