import { IconPropsModel } from "@/models/common/CommonModels";

export default function SearchIcon({
    width = 20,
    height = 20,
    color = "#000000",
}: IconPropsModel) {
return (
    <svg width={width} height={height} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill={color}>
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
            <title>ionicons-v5-f</title>
            <path d="M221.09,64A157.09,157.09,0,1,0,378.18,221.09,157.1,157.1,0,0,0,221.09,64Z" fill="#ffffff" stroke="#000000" strokeMiterlimit={10} strokeWidth={32}></path>
            <line x1="338.29" y1="338.29" x2="448" y2="448" fill={color} stroke="#000000" strokeMiterlimit={10} strokeWidth={32} strokeLinecap="round"></line>
        </g>
    </svg>
);
} 