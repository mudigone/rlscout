import supabase from "@/lib/db";
import PlayersTable from "./PlayersTable";
export const revalidate = 0;


export default async function Home() {
  let { data: players_table, error } = await supabase.from("players_table")
    .select(`
    users (id, username, ingamename, user_details(id, current_rank))
  `);

  if (error) return <div>Failed to fetch players: {error.message}</div>;
  return (
    <div>
      <PlayersTable players_table={players_table} />
    </div>
  );
}
