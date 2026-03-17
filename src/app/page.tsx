import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-red-200 p-30">
      Dashboard Go to admin view{" "}
      <Link href="/beholdere" className="bg-green-300 border-2">
        Admin view
      </Link>
    </div>
  );
}
