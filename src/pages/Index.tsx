import { useState } from "react";
import { MACHINE_CONFIGS } from "@/types/measurement";
import { MachineTab } from "@/components/MachineTab";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AboutUs from "@/pages/AboutUs";

const Index = () => {
  const [activeMachine, setActiveMachine] = useState(MACHINE_CONFIGS[0].id);
  const [activeView, setActiveView] = useState<string>("machine");
  const activeConfig = MACHINE_CONFIGS.find((m) => m.id === activeMachine)!;
  const headerTitle = activeView === "about" ? "About Us" : activeConfig.name;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar
          activeMachine={activeMachine}
          onMachineChange={setActiveMachine}
          activeView={activeView}
          onViewChange={setActiveView}
        />

        <div className="flex flex-1 flex-col">
          <header className="flex h-12 items-center gap-2 border-b bg-card px-4">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold text-foreground">
              {headerTitle}
            </h1>
          </header>

          <main className="flex-1 p-4 md:p-6">
            {activeView === "about" ? (
              <AboutUs />
            ) : (
              <MachineTab key={activeConfig.id} config={activeConfig} />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
