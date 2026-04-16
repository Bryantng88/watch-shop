import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        {/* Providers, Theme, Toaster... */}
        {children}
      </body>
    </html>
  );
}