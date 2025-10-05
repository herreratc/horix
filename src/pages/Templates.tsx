import { DashboardLayout } from "@/components/DashboardLayout";
import { TemplatesMensagens } from "@/components/TemplatesMensagens";

export default function Templates() {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <TemplatesMensagens />
      </div>
    </DashboardLayout>
  );
}