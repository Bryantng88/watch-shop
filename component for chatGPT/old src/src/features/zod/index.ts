// Chỉ re-export những thứ bạn dùng hằng ngày
export {
    ProductArgsObjectSchema as ProductSchema,
    ProductCreateInputObjectSchema as ProductCreateInputSchema,
    ProductUpdateInputObjectSchema as ProductUpdateInputSchema,

} from "@/features/__generated__/zod/schemas/objects";

export {
    BrandArgsObjectSchema as BrandSchema
} from "@/features/__generated__/zod/schemas/objects";

export {
    ComplicationArgsObjectSchema as ComplicationSchema,
} from "@/features/__generated__/zod/schemas/objects";
