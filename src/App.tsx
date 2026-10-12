import IsItRelayLogo from '@/components/IsItRelayLogo';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function App() {
  return (
    <div className="dark min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <header className="mb-8 text-center sm:mb-10">
          <div className="mb-4 flex items-center justify-center">
            <IsItRelayLogo className="h-10 sm:h-12 md:h-14" />
          </div>
          <p className="mx-auto max-w-md text-sm text-muted-foreground sm:text-base">
            Relay Protocol address detector, preserved as a static demo
          </p>
        </header>

        <aside
          aria-label="Project status"
          className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-4 text-sm text-amber-100"
        >
          <p className="font-semibold">Project discontinued</p>
          <p className="mt-1">
            Relay API changes ended sustainable public read-only access. This site no longer checks live addresses;
            it remains online as a demo.
          </p>
          <a
            href="https://github.com/warengonzaga/is-it-relay#project-status"
            className="mt-2 inline-block font-medium underline underline-offset-4 hover:text-white"
          >
            Read the project notice
          </a>
        </aside>

        <Card className="border-border/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Example detection result</CardTitle>
            <CardDescription>
              A static preview of the former address-detection interface. No Relay API requests are made.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Illustrative sample</p>
              <p className="mt-2 font-mono text-sm text-foreground">0x71c765...d8976f</p>
              <p className="mt-3 text-sm font-medium">Example protocol contract match</p>
              <p className="mt-1 text-sm text-muted-foreground">Example EVM chain · Contract category</p>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              The address and match above are fictional demo content. They do not represent a verified Relay address
              or current protocol data.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
