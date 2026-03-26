import Image from "next/image";
import Menu from "./Menu";
import Link from "next/link";

// Navigation container

function Navigation() {
  return (
    <div className="h-screen fixed max-w-60 p-5 bg-gray-100">
      <Link
        href="/dashbord"
        className="flex items-center gap-2 cursor-pointer mb-6"
      >
        <Image
          src="/norkart.webp"
          alt="Navigation Image"
          width={150}
          height={150}
        />
      </Link>

      <Menu />
    </div>
  );
}
export default Navigation;
