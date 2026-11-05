import React from "react";
import Markdown from "react-markdown";

// No raw HTML, model images or executable/external URLs. Product photos have
// their own server-authorized cards; model text cannot introduce an image.
export function safeBenLink(value: string): string | undefined {
  return /^\/admin(?:\/|$)/.test(value) && !/[\\\u0000-\u0020]/.test(value) ? value : undefined;
}
export default function BenMessage({ text }: { text: string }) {
  return <div className="break-words text-sm leading-6 [&_p+p]:mt-3 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_strong]:font-semibold [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-slate-50 [&_pre]:p-2 [&_code]:break-words [&_h1]:font-semibold [&_h2]:font-semibold [&_h3]:font-semibold">
    <Markdown skipHtml disallowedElements={["img"]} urlTransform={safeBenLink} components={{a:({children,href})=>href?<a href={href} className="font-medium text-blue-700 underline underline-offset-2">{children}</a>:<span>{children}</span>}}>{text}</Markdown>
  </div>;
}
