import Link from "next/link";

type StorefrontSectionLandingProps = {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  actionHref?: string;
};

export default function StorefrontSectionLanding({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref = "/products",
}: StorefrontSectionLandingProps) {
  return (
    <section className="mx-auto grid min-h-[62vh] max-w-[1440px] place-items-center px-4 py-16 sm:px-6 lg:px-10">
      <div className="w-full max-w-3xl border border-[#dedbd4] bg-[#f4f4f1] px-6 py-14 text-center sm:px-12 sm:py-20">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#7b7770]">{eyebrow}</p>
        <h1 className="storefront-display mt-4 text-4xl leading-tight sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#68645e]">{description}</p>
        <Link href={actionHref} className="storefront-focus mt-8 inline-grid min-h-11 place-items-center bg-[#46545e] px-7 text-[10px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#35434b]">
          {actionLabel}
        </Link>
      </div>
    </section>
  );
}
