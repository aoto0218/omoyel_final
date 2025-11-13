import Image from "next/image";
import Link from "next/link";
import LinkButton from "./components/LinkButton";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <LinkButton href="map">map</LinkButton>
        <LinkButton href="ai">AI</LinkButton>
        <LinkButton href="other">other</LinkButton>
      </main>
    </div>
  );
}
