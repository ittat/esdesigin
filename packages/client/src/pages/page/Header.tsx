import {
  BackIcon,
  MobileIcon,
  PCIcon,
  PlayIcon,
  RedoIcon,
  ShareIcon,
} from "@/assets/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Switcher, { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Header() {
  return (
    <div className="flex justify-between items-center border-b h-[var(--layout-header-height)]">
      <div className="">
        <div className="pl-2 flex items-center gap-4">
          <BackIcon width="20" height="20" />
          <div className="flex flex-col">
            <span className="text-lg font-thin">Page Name</span>
            <div className="text-xs  font-thin flex gap-2">
              <desc>the page description</desc>
              <desc>v0.0.1-a</desc>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-grow flex justify-center">
        <Switcher
          defaultValue="pc"
          list={[
            {
              label: <PCIcon />,
              value: "pc",
            },
            {
              label: <MobileIcon />,
              value: "mb",
            },
          ]}
          classNames={{
            main: "",
            trigger:
              "cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-white ",
            content: "",
          }}
          onChange={console.log}
        />
      </div>
      <div className="flex gap-1">
        <Button variant={"outline"} size="icon">
          <RedoIcon />

          <RedoIcon className="rotate-180 transform-gpu" />
        </Button>

        <div className="peoples mx-2 flex gap-1">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        <Button className="flex gap-1" size="sm">
          <ShareIcon />
          Invite
        </Button>

        <Button className="flex gap-1" size="sm">
          <PlayIcon />
          Preview
        </Button>
      </div>
    </div>
  );
}

export default Header;
