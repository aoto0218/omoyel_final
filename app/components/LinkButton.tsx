import Link from "next/link";
import { ReactNode } from "react";

interface LinkButtonProps {
  href: string;
  children: ReactNode;
}

export default function LinkButton({href,children}: LinkButtonProps) {
    return(
    <Link href={href}>
        {children}
    </Link>
    );
}