export type ProductStatus = "sold" | "on hold";

export type Product = {
    id: number;
    img: string;
    title: string;
    price: number;          // nếu bạn xử lý số, cân nhắc đổi thành number
    status?: ProductStatus; // optional nếu không phải sp nào cũng có
    brand?: string;
    year?: string;
    ref?: string;
    material?: string;
    caseSize?: string;
    dialColor?: string;
    strap?: string;
};