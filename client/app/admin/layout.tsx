import { AdminGuard } from "@/components/AdminGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen ">
        <div className="mx-auto">{children}</div>
      </div>
    </AdminGuard>
  );
}
