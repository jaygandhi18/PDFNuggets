import { FileText } from "lucide-react";
import NavLink from "./nav-link";
import PlanBadge from "./plan-badge";
import {
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export const Header = () => {
  return (
    <header className="container flex items-center justify-between py-4 lg:px-8 px-2 mx-auto">
      <div className="flex lg:flex-1">
        <NavLink href="/" className="flex items-center gap-1 lg:gap-2 shrink-0">
          <FileText className="w-5 h-5 lg:w-8 lg:h-8 text-emerald-700 hover:text-teal-500 hover:rotate-12 transform transition duration-200 ease-in-out" />
          <span className="font-extrabold lg:text-xl text-emerald-900">PDFNuggets</span>
        </NavLink>
      </div>

      <div className="flex justify-center items-center gap-4 lg:gap-12 text-sm lg:text-base">
        <NavLink href="/#pricing" className="text-emerald-700 hover:text-teal-600 text-sm lg:text-base">
          Pricing
        </NavLink>
        <SignedIn>
          <NavLink href="/dashboard" className="text-emerald-700 hover:text-teal-600 text-sm lg:text-base">
            Your Summaries
          </NavLink>
        </SignedIn>
      </div>

      <div className="flex lg:justify-end lg:flex-1">
        <SignedIn>
          <div className="flex gap-2 items-center">
            <NavLink href="/upload" className="text-emerald-700 hover:text-teal-600">
              Upload a PDF
            </NavLink>
            <PlanBadge />
            <UserButton />
          </div>
        </SignedIn>
        <SignedOut>
          <NavLink href="/sign-in" className="text-emerald-700 hover:text-teal-600">
            Sign In
          </NavLink>
        </SignedOut>
      </div>
    </header>
  );
};
