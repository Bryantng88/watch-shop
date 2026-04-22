import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SystemJobControlSelectObjectSchema as SystemJobControlSelectObjectSchema } from './objects/SystemJobControlSelect.schema';
import { SystemJobControlWhereUniqueInputObjectSchema as SystemJobControlWhereUniqueInputObjectSchema } from './objects/SystemJobControlWhereUniqueInput.schema';

export const SystemJobControlFindUniqueOrThrowSchema: z.ZodType<Prisma.SystemJobControlFindUniqueOrThrowArgs> = z.object({ select: SystemJobControlSelectObjectSchema.optional(),  where: SystemJobControlWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SystemJobControlFindUniqueOrThrowArgs>;

export const SystemJobControlFindUniqueOrThrowZodSchema = z.object({ select: SystemJobControlSelectObjectSchema.optional(),  where: SystemJobControlWhereUniqueInputObjectSchema }).strict();