import "bootstrap/dist/css/bootstrap.min.css";
import BootstrapClient from "../BootstrapClient";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white">
      {children}
      <BootstrapClient />
    </div>
  );
}
