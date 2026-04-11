import { HouseTable } from "../components/house/HouseTable";
import { Container } from "../components/layout/Container";
import { SiteHeader } from "../components/layout/SiteHeader";

export function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <Container className="pb-16 pt-6">
          <HouseTable />
        </Container>
      </main>
    </div>
  );
}
