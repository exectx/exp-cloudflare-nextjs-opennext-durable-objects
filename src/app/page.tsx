import { getCloudflareContext } from "@opennextjs/cloudflare";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

function getCounterDurableObject() {
  const cf = getCloudflareContext();
  const id = cf.env.Counter.idFromName("global-counter");
  const stub = cf.env.Counter.get(id);
  console.log("Durable Object ID:", id);
  return stub;
}

async function incrementCounter() {
  "use server";
  await getCounterDurableObject().increment();
  revalidatePath("/");
}

async function decrementCounter() {
  "use server";
  await getCounterDurableObject().decrement();
  revalidatePath("/");
}

export default async function Home() {
  const count = await getCounterDurableObject().getCounterValue();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          Counter: {count}
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <form action={incrementCounter}>
            <button
              type="submit"
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              aria-label="Increment counter"
            >
              Increment
            </button>
          </form>
          <form action={decrementCounter}>
            <button
              type="submit"
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              aria-label="Decrement counter"
            >
              Decrement
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
