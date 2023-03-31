import { Tab as HeadlessTab } from "@headlessui/react";
import type { ExtractProps } from "../types";

export const Tab = (props: ExtractProps<typeof HeadlessTab>) => {
  return (
    <HeadlessTab
      className="m-1.5 px-3.5 py-2.5 font-semibold text-gray-500 focus:outline-none aria-selected:rounded-md aria-selected:bg-white aria-selected:text-gray-700 aria-selected:shadow"
      {...props}
    />
  );
};

export const TabGroup = (props: ExtractProps<typeof HeadlessTab.Group>) => {
  return <HeadlessTab.Group {...props} />;
};

export const TabPanel = (props: ExtractProps<typeof HeadlessTab.Panel>) => {
  return <HeadlessTab.Panel {...props} />;
};

export const TabPanels = (props: ExtractProps<typeof HeadlessTab.Panels>) => {
  return <HeadlessTab.Panels className="mt-8" {...props} />;
};

export const TabList = (props: ExtractProps<typeof HeadlessTab.List>) => {
  return (
    <HeadlessTab.List
      className="flex flex-row items-stretch gap-2 rounded-lg border border-gray-100 bg-gray-50"
      {...props}
    />
  );
};
