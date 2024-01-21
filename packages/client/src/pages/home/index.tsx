import { Outlet } from "react-router-dom";

import LogoSVG from "../../assets/logo.svg";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { styled } from "@mui/material";
import React from "react";
import { Label } from "@/components/ui/label";

import PageList from "./PageList";
import { AddIcon, BoxIcon, HistoryIcon } from "@/assets/Icons";
import Switcher from "@/components/ui/tabs";

const Header = styled("div")`
  height: var(--layout-header-height);
`;
const Asider = styled("div")`
  width: var(--layout-sider-width);
  float: left;

  height: 100vh; // calc(100vw-var(--layout-header-height));
`;

const ArchiveItem = ({
  icon,
  label,
}: {
  icon?: React.ReactNode;
  label: string;
}) => {
  return (
    <div className="m-1 p-1 px-2 rounded-sm hover:bg-muted">
      <label className="flex gap-2 items-center text-sm font-medium text-muted-foreground">
        {icon ?? null}
        {label}
      </label>
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="w-full h-full">
      <Header className="flex p-2 pr-4 items-center justify-between">
        <div className="flex items-center">
          <div className="w-[35px] mx-5">
            {/* Logo */}
            <img src={LogoSVG} />
          </div>

          <Button variant="link">Settings</Button>
          <Button variant="link">About</Button>
        </div>

        <div className="w-[300px] flex gap-4 items-center">
          <Input placeholder="Search" />

          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </Header>

      <Separator />

      <Asider className="flex  flex-col">
        <div className="flex flex-col p-4">
          <Label>Archives</Label>
          {/* Recent */}
          <ArchiveItem label="Recent" icon={<HistoryIcon />} />
          <ArchiveItem label="Workspaces1" icon={<BoxIcon />} />
          <ArchiveItem label="Workspaces2" icon={<BoxIcon />} />

          <ArchiveItem label="Add Workspace" icon={<AddIcon />} />

          {/* <Separator /> */}
          {/* <Button variant="ghost" size={"default"}> <AddIcon/> Add Workspace</Button> */}
        </div>

        {/* <Setting /> */}
      </Asider>

      <main className="flex flex-col p-5 bg-[#f3f3f3] h-screen">
        <header>
          <Label title="Recent" className="text-2xl">
            Recent
          </Label>
        </header>
        {/* apps */}

        <Switcher
          defaultValue="Pages"
          list={[
            {
              label: "Pages",
              value: "Pages",
              content: <PageList />,
            },
            {
              label: "Components",
              value: "Components",
              content: "   Change your password here.",
            },
          ]}
          classNames={{
            main:"w-[800px] mt-10 ml-10",
            trigger: "mb-5 data-[state=active]:text-foreground data-[state=active]:border-2 data-[state=active]:border-primary",
            content:"ml-3"
          }}
        />

      </main>
    </div>
  );
};

export default HomePage;
