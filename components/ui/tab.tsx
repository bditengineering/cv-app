import { Tab as HeadlessTab } from "@headlessui/react";
import type { ExtractProps } from "../types";

export const Tab = (props: ExtractProps<typeof HeadlessTab>) => {
  return (
    <HeadlessTab
      className="aria-selected:bg-white aria-selected:text-gray-700 aria-selected:font-medium aria-selected:rounded-md aria-selected:shadow px-3 py-2 text-gray-500 outline-none"
      {...props}
    />
  );
};

export const TabGroup = (props: ExtractProps<typeof HeadlessTab.Group>) => {
  return <HeadlessTab.Group {...props} />;
};

export const TabPanel = (props: ExtractProps<typeof HeadlessTab.Panel>) => {
  return (
    <HeadlessTab.Panel
      className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
      {...props}
    />
  );
};

export const TabPanels = (props: ExtractProps<typeof HeadlessTab.Panels>) => {
  return <HeadlessTab.Panels className="mt-8" {...props} />;
};

export const TabList = (props: ExtractProps<typeof HeadlessTab.List>) => {
  return (
    <HeadlessTab.List
      className="bg-gray-50 border-solid border-1 border-gray-100 rounded-lg gap-2 flex flex-row items-center"
      {...props}
    />
  );
};
