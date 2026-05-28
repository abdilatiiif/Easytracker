import Image from "next/image";
import Menu from "./Menu";
import Link from "next/link";

function Navigation() {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-60 border-r bg-slate-50 p-5 lg:block">
      <Link href="/" className="mb-6 flex items-center gap-2">
        <Image src="/norkart.webp" alt="Easytracker" width={150} height={150} />
      </Link>

      <Menu />
    </aside>
  );
}
export default Navigation;
