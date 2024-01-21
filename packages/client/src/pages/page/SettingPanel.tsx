import { Separator } from "@/components/ui/separator";
import { cx } from "class-variance-authority";

export default function SettingPanel() {
  return (
    <div
      className={cx(
        "fixed h-[calc(100vh-var(--layout-header-height))] w-[var(--layout-left-panel-width)] top-[var(--layout-header-height)] right-1",
        "p-2",
        "bg-background"
      )}
    >
      <div className="relative flex flex-col w-full h-full border shadow-lg rounded-lg">
        <div className="w-full flex justify-between p-3 items-center">
          <span className="text-sm">Setter</span>
        </div>

        <Separator />

        {/* todo panel content */}
      </div>
    </div>
  );
}
