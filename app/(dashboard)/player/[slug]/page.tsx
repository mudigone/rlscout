import supabase from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Page({ params }: { params: { slug: string } }) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", params.slug);

  const user = data?.[0];

  if (error) return <div>User not found!</div>;

  return (
    <div className="flex">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-2">
              <span className="font-bold">Username:</span>
              <span>{user.username}</span>
            </div>
            <div className="flex space-x-2">
              <span className="font-bold">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="flex space-x-2">
              <span className="font-bold">In-game name:</span>
              <span>{user.ingamename}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
