import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaBindingCreateWithoutMediaObjectInputObjectSchema as MediaBindingCreateWithoutMediaObjectInputObjectSchema } from './MediaBindingCreateWithoutMediaObjectInput.schema';
import { MediaBindingUncheckedCreateWithoutMediaObjectInputObjectSchema as MediaBindingUncheckedCreateWithoutMediaObjectInputObjectSchema } from './MediaBindingUncheckedCreateWithoutMediaObjectInput.schema';
import { MediaBindingCreateOrConnectWithoutMediaObjectInputObjectSchema as MediaBindingCreateOrConnectWithoutMediaObjectInputObjectSchema } from './MediaBindingCreateOrConnectWithoutMediaObjectInput.schema';
import { MediaBindingCreateManyMediaObjectInputEnvelopeObjectSchema as MediaBindingCreateManyMediaObjectInputEnvelopeObjectSchema } from './MediaBindingCreateManyMediaObjectInputEnvelope.schema';
import { MediaBindingWhereUniqueInputObjectSchema as MediaBindingWhereUniqueInputObjectSchema } from './MediaBindingWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MediaBindingCreateWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaBindingCreateWithoutMediaObjectInputObjectSchema).array(), z.lazy(() => MediaBindingUncheckedCreateWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaBindingUncheckedCreateWithoutMediaObjectInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MediaBindingCreateOrConnectWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaBindingCreateOrConnectWithoutMediaObjectInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MediaBindingCreateManyMediaObjectInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => MediaBindingWhereUniqueInputObjectSchema), z.lazy(() => MediaBindingWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const MediaBindingUncheckedCreateNestedManyWithoutMediaObjectInputObjectSchema: z.ZodType<Prisma.MediaBindingUncheckedCreateNestedManyWithoutMediaObjectInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaBindingUncheckedCreateNestedManyWithoutMediaObjectInput>;
export const MediaBindingUncheckedCreateNestedManyWithoutMediaObjectInputObjectZodSchema = makeSchema();
