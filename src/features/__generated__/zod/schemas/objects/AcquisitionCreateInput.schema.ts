import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionTypeSchema } from '../enums/AcquisitionType.schema';
import { AcquisitionStatusSchema } from '../enums/AcquisitionStatus.schema';
import { AudienceSegmentSchema } from '../enums/AudienceSegment.schema';
import { CustomerCreateNestedOneWithoutAcquisitionInputObjectSchema as CustomerCreateNestedOneWithoutAcquisitionInputObjectSchema } from './CustomerCreateNestedOneWithoutAcquisitionInput.schema';
import { VendorCreateNestedOneWithoutAcquisitionInputObjectSchema as VendorCreateNestedOneWithoutAcquisitionInputObjectSchema } from './VendorCreateNestedOneWithoutAcquisitionInput.schema';
import { AcquisitionItemCreateNestedManyWithoutAcquisitionInputObjectSchema as AcquisitionItemCreateNestedManyWithoutAcquisitionInputObjectSchema } from './AcquisitionItemCreateNestedManyWithoutAcquisitionInput.schema';
import { InvoiceCreateNestedManyWithoutAcquisitionInputObjectSchema as InvoiceCreateNestedManyWithoutAcquisitionInputObjectSchema } from './InvoiceCreateNestedManyWithoutAcquisitionInput.schema';
import { TaskCreateNestedManyWithoutAcquisitionInputObjectSchema as TaskCreateNestedManyWithoutAcquisitionInputObjectSchema } from './TaskCreateNestedManyWithoutAcquisitionInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  type: AcquisitionTypeSchema.optional(),
  acquiredAt: z.coerce.date(),
  totalAmount: z.number().optional().nullable(),
  currency: z.string().optional().nullable(),
  payoutStatus: z.string().optional().nullable(),
  accquisitionStt: AcquisitionStatusSchema.optional(),
  refNo: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  condition: z.string().optional().nullable(),
  warrantyUntil: z.coerce.date().optional().nullable(),
  audienceSegment: AudienceSegmentSchema.optional(),
  createdAt: z.coerce.date().optional(),
  sentAt: z.coerce.date().optional().nullable(),
  returnedAt: z.coerce.date().optional().nullable(),
  customer: z.lazy(() => CustomerCreateNestedOneWithoutAcquisitionInputObjectSchema).optional(),
  vendor: z.lazy(() => VendorCreateNestedOneWithoutAcquisitionInputObjectSchema).optional(),
  acquisitionItem: z.lazy(() => AcquisitionItemCreateNestedManyWithoutAcquisitionInputObjectSchema),
  Invoice: z.lazy(() => InvoiceCreateNestedManyWithoutAcquisitionInputObjectSchema),
  Task: z.lazy(() => TaskCreateNestedManyWithoutAcquisitionInputObjectSchema)
}).strict();
export const AcquisitionCreateInputObjectSchema: z.ZodType<Prisma.AcquisitionCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionCreateInput>;
export const AcquisitionCreateInputObjectZodSchema = makeSchema();
