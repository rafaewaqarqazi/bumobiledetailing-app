import Main from "@/components/Main";
import AdminRoutes from "@/components/routes/AdminRoutes";
import AdminLayout from "@/components/layouts/AdminLayout";
export default async function Home() {
  return (
    <AdminRoutes>
      <AdminLayout>
        <Main />
      </AdminLayout>
    </AdminRoutes>
  );
}
