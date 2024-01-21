import { CloseIcon } from "@/assets/Icons";
import { Separator } from "@/components/ui/separator";
import { cx } from "class-variance-authority";

export default function LeftPanel() {
  return (
    <div
    style={{
      display:"none"
    }}
      className={cx(
        "fixed h-[calc(100vh-var(--layout-header-height))] w-[var(--layout-left-panel-width)] left-[var(--layout-sider-min-width)] top-[var(--layout-header-height)]",
        "p-2",
        "bg-background"
      )}
    >
      <div className="relative flex flex-col w-full h-full border shadow-lg rounded-lg">
        <div className="w-full flex justify-between p-3 items-center">
          <span className="text-sm">Panel Name</span>
          <span className="">
            <CloseIcon />
          </span>
        </div>

        <Separator />

        {/* todo panel content */}
      </div>
    </div>
  );
}
