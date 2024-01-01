"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useContext, useEffect, useState } from "react";
import supabase from "@/lib/db";
import { UserContext } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useToast } from "@/components/ui/use-toast";
const PlayersTable = ({ players_table }: any) => {
  const { user } = useContext(UserContext);
  const [hasUserJoined, setHasUserJoined] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  useEffect(() => {
    const checkIfUserJoined = async () => {
      let { data } = await supabase
        .from("players_table")
        .select("*")
        .eq("id", user.id);

      if (data?.length) setHasUserJoined(true);
      else setHasUserJoined(false);
    };
    checkIfUserJoined();
  }, [players_table]);

  const joinTable = async (router: AppRouterInstance) => {
    const { data, error } = await supabase
      .from("players_table")
      .insert({ id: user.id });
    // location.reload();
    router.refresh();

    toast({
      title: "Table Joined",
      description: "Successfully joined the table!",
    });
  };

  const leaveTable = async (router: AppRouterInstance) => {
    await supabase.from("players_table").delete().eq("id", user.id);
    router.refresh();
    toast({
      title: "Table Left",
      description: "Successfully left the table!",
      variant: "destructive",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <span className="text-3xl font-bold">Real League Player Scout</span>

          <Button
            size="sm"
            variant={hasUserJoined ? "destructive" : "default"}
            onClick={
              hasUserJoined ? () => leaveTable(router) : () => joinTable(router)
            }
          >
            {hasUserJoined ? "Leave Table" : "Join Table"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table className="bg-white rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>In-Game Name</TableHead>
              <TableHead>Current Rank</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!players_table?.length && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No players found!
                </TableCell>
              </TableRow>
            )}

            {players_table?.map(({ users }: any) => (
              <TableRow key={users?.id}>
                <TableCell>{users?.username}</TableCell>
                <TableCell>{users?.ingamename}</TableCell>
                <TableCell>
                  {users?.user_details?.current_rank || "-"}
                </TableCell>
                <TableCell>
                  <Link href={`/player/${users.id}`}>
                    <Button size="sm">View</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PlayersTable;
