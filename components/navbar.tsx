"use client";

import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "./logo";
import { Plus } from "@ui/icons";
import Button, { buttonClasses } from "@ui/button";
import Container from "@ui/container";
import supabase from "../utils/supabase_browser";
import type { User } from "@supabase/supabase-js";

interface NavBarProps {
  title?: string;
  user?: User;
}

export default function NavBar({ title, user }: NavBarProps) {
  const router = useRouter();

  async function signOut() {
    await supabase.auth.signOut();
    await router.push("/");
  }

  return (
    <Disclosure as="nav" className="border-b border-b-gray-200">
      <Container className="flex h-16 items-center justify-between">
        <div className="text-gray-600">
          <Logo />

          {title && (
            <>
              <span className="w-4">/</span>
              <span className="px-2">{title}</span>
            </>
          )}
        </div>

        <div className="ml-4 flex items-center md:ml-6">
          <Link
            className={buttonClasses({ variant: "tinted", size: "small" })}
            prefetch={false}
            href="/new"
          >
            <Plus className="h-5 w-5" /> Add new CV
          </Link>

          {/* Profile dropdown */}
          <Menu as="div" className="relative ml-3">
            <Menu.Button className="rounded-full border bg-white p-2 text-sm font-semibold uppercase focus:outline-none focus:ring-4 focus:ring-indigo-100">
              {user?.email ? user.email.slice(0, 2) : "jd"}
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item
                  as={Button}
                  className="w-full rounded-none"
                  onClick={signOut}
                  variant="plain"
                >
                  Sign out
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </Container>
    </Disclosure>
  );
}
