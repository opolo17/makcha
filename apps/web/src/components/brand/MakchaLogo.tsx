import Image from "next/image";

type MakchaLogoProps = {
  className?: string;
  priority?: boolean;
};

export function MakchaLogo({ className = "h-9 w-auto", priority }: MakchaLogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="MAKCHA 막차"
      width={200}
      height={48}
      className={className}
      priority={priority}
    />
  );
}
