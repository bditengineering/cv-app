export default function Test({
  params: { nesto },
}: {
  params: { nesto: string };
}) {
  return <h1>{nesto}</h1>;
}

export const dynamic = "force-static";
