import Image from "next/image";
import Menu from "./Menu";

// Navigation container

function Navigation() {
  return (
    <div className="h-screen max-w-60 p-5 bg-gray-100">
      <Image
        className="p-2"
        src="/norkart.webp"
        alt="Navigation Image"
        width={150}
        height={150}
      />

      <Menu />
    </div>
  );
}
export default Navigation;
