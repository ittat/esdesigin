import React, { PropsWithChildren, useContext, useMemo } from "react";
import { components, types } from "@ittat/esdesign-components";
import AppConfig from "./states/appConfig";
import PageConfig from "./states/pageConfig";
import { appsConfig } from "./db";

export const appConfigProvider = React.createContext<{
  configs: AppConfig[] | null;
}>({
  configs: null,
});

export const materialProvider = React.createContext<{
  materials: Record<string, types.IESDesiginComponent>;
}>({
  materials: {},
});

export const useMaterial = () => {
  const custom = useContext(materialProvider);

  return custom.materials;
};

export const getAppController = (appId: string) => {
  const custom = useContext(appConfigProvider);
  return custom.configs?.find((c) => c.id == appId);
};

export const Provider: React.FC<PropsWithChildren<{ preview?: boolean }>> = (
  props
) => {
  const globalData = useMemo(() => {
    const results: Record<string, types.IESDesiginComponent> = {};
    for (const key in components.default) {
      results[key] = components.default[key];
    }

    const apps = appsConfig.map(
      (c) =>
        new AppConfig({
          appConfig: c,
          materials: results,
          preview: props?.preview || false,
        })
    );

    return {
      // materials:results,
      configs: apps,
    };
  }, []);

  return (  
    <appConfigProvider.Provider value={globalData}>
      {props.children}
    </appConfigProvider.Provider>
  );
};

export const AppProvider = React.createContext<{
  pageApi?: PageConfig;
  appId?: string;
  appApi?: AppConfig;
}>({

});

export const getPageApi = () => {
  const { pageApi } = useContext(AppProvider);
  return pageApi;
};

export const getAppApi = () => {
  const { appApi, appId } = useContext(AppProvider);
  return { appApi, appId };
};
