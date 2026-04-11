import { HouseTable } from "../components/house/HouseTable";
import { Container } from "../components/layout/Container";
import { SiteHeader } from "../components/layout/SiteHeader";

export function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <div className="bg-[var(--bg-purple-light)] w-[100%]">
          <div className="flex items-center justify-center py-30 px-4">
            <div className="mx-auto max-w-2xl w-[100%] md:w-[50%] sm:w-[75%]">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Find your dream home.
                <br />
                <span className="text-[var(--color-purple)]">
                  Fast and easy.
                </span>
              </h1>
              <p className="mt-3 text-base leading-relaxed text-gray-600">
                Browse our catalog and compare homes on your own timeline. When
                you’re ready, email us the address or a short note about what
                caught your eye—we’ll follow up and help you with the next
                steps.
              </p>
            </div>
          </div>
        </div>
        <Container className="py-15">
          <HouseTable />
        </Container>
      </main>
    </div>
  );
}
