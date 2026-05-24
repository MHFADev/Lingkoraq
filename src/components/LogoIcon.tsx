import Image from "next/image";
export default function LogoIcon({ className }: { className?: string }) {
  return <Image src="/lingkoraq-logo.svg" alt="Lingkoraq" width={24} height={24} className={className} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
}
