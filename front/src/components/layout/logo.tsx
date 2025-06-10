import { Leaf } from "lucide-react";
import Link from "next/link";

export function Logo({collapsed} : {collapsed?: boolean}) {
    return (
        <Link href="/" className="flex items-center gap-2 px-4 py-4 text-lg font-semibold text-primary">
            <Leaf className="h-6 w-6 text-primary" />
            {!collapsed && <span className="font-headline"></span>}
        </Link>
    );
}