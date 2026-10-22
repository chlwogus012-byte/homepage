import Image from "next/image";
import { Container } from "@/components/ui/Container";

type ClientLogo = {
  name: string;
  logo?: { src: string; alt: string };
  isSample?: boolean;
};

type ClientsProps = {
  heading: string;
  description?: string;
  clients: ClientLogo[];
};

function ClientChip({ client, inverted }: { client: ClientLogo; inverted: boolean }) {
  const toneClasses = inverted
    ? "border-border bg-inverse-background text-inverse-text"
    : "border-border bg-background text-text-muted";

  return (
    <li className={`flex h-16 min-w-[160px] shrink-0 items-center justify-center rounded-lg border px-6 ${toneClasses}`}>
      {client.logo ? (
        <Image
          src={client.logo.src}
          alt={client.logo.alt}
          width={120}
          height={40}
          className="h-8 w-auto object-contain"
        />
      ) : (
        <span className="whitespace-nowrap text-sm font-medium">
          {client.name}
          {client.isSample ? <span className="ml-1 text-xs opacity-60">(샘플)</span> : null}
        </span>
      )}
    </li>
  );
}

export function Clients({ heading, description, clients }: ClientsProps) {
  if (clients.length === 0) return null;

  return (
    <section id="clients" className="scroll-mt-24 border-b border-border bg-surface py-16 md:py-24">
      <Container className="flex flex-col gap-3 text-center md:text-left">
        <h2 className="text-2xl font-semibold tracking-tight text-text md:text-4xl">{heading}</h2>
        {description ? <p className="text-sm text-text-muted md:text-base">{description}</p> : null}
      </Container>

      <div
        className="relative mt-10 overflow-hidden"
        style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}
      >
        <div className="marquee-track flex w-max items-center gap-4 px-6">
          <ul className="flex shrink-0 items-center gap-4" aria-label="주요 거래처">
            {clients.map((client, index) => (
              <ClientChip key={client.name} client={client} inverted={index % 2 === 1} />
            ))}
          </ul>
          <ul className="flex shrink-0 items-center gap-4" aria-hidden="true">
            {clients.map((client, index) => (
              <ClientChip key={`${client.name}-dup`} client={client} inverted={index % 2 === 1} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
