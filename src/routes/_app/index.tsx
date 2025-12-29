import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/")({
  component: App,
});

function App() {
  return (
    <div>
      {/* <h1>Anggap aja ini adalah home page apapun isinya biar ada aja.</h1> */}
    </div>
  );
}
