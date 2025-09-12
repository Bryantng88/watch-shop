import { IconPropsModel } from "@/models/common/CommonModels";

export default function EmailIcon({
    width = 20,
    height = 20,
    color = "#000000",
}: IconPropsModel) {
return (
    <svg width={width} height={height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={color}>
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier"> 
            <g data-name="Layer 2"> 
                <g data-name="email"> 
                    <rect width={width/10} height={height/10} opacity="0"></rect> 
                    <path d="M19 4H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-.67 2L12 10.75 5.67 6zM19 18H5a1 1 0 0 1-1-1V7.25l7.4 5.55a1 1 0 0 0 .6.2 1 1 0 0 0 .6-.2L20 7.25V17a1 1 0 0 1-1 1z"></path> 
                </g> 
            </g> 
        </g>
    </svg>
);
} 