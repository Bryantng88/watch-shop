import * as z from 'zod';

import { VendorRoleSchema } from '../../enums/VendorRole.schema';
// prettier-ignore
export const VendorResultSchema = z.object({
    id: z.string(),
    name: z.string(),
    role: VendorRoleSchema,
    isAuthorized: z.boolean(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    address: z.string().nullable(),
    note: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    bankName: z.string().nullable(),
    bankAcc: z.string().nullable(),
    isActive: z.boolean(),
    Acquisition: z.array(z.unknown()),
    Invoice: z.array(z.unknown()),
    MaintenanceRecord: z.array(z.unknown()),
    product: z.array(z.unknown()),
    serviceRequest: z.array(z.unknown()),
    technicalAssessment: z.array(z.unknown()),
    technicalIssue: z.array(z.unknown()),
    bank: z.unknown().nullable()
}).strict();

export type VendorResultType = z.infer<typeof VendorResultSchema>;
