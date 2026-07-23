import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaBindingWhereUniqueInputObjectSchema as MediaBindingWhereUniqueInputObjectSchema } from './MediaBindingWhereUniqueInput.schema';
import { MediaBindingCreateWithoutMediaObjectInputObjectSchema as MediaBindingCreateWithoutMediaObjectInputObjectSchema } from './MediaBindingCreateWithoutMediaObjectInput.schema';
import { MediaBindingUncheckedCreateWithoutMediaObjectInputObjectSchema as MediaBindingUncheckedCreateWithoutMediaObjectInputObjectSchema } from './MediaBindingUncheckedCreateWithoutMediaObjectInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MediaBindingWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MediaBindingCreateWithoutMediaObjectInputObjectSchema), z.lazy(() => MediaBindingUncheckedCreateWithoutMediaObjectInputObjectSchema)])
}).strict();
export const MediaBindingCreateOrConnectWithoutMediaObjectInputObjectSchema: z.ZodType<Prisma.MediaBindingCreateOrConnectWithoutMediaObjectInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaBindingCreateOrConnectWithoutMediaObjectInput>;
export const MediaBindingCreateOrConnectWithoutMediaObjectInputObjectZodSchema = makeSchema();
