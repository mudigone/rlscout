import supabase from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserDetails } from "../../profile/page";
import PostAReview from "./PostAReview";
import { Rating } from "@mui/material";
export const revalidate = 0;

export default async function Page({ params }: { params: { slug: string } }) {
  let { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", params.slug);
  const user = data?.[0];
  let { data: data1 } = await supabase
    .from("user_details")
    .select("*")
    .eq("id", params.slug);
  const userDetails = data1?.[0];
  let { data: data2 } = await supabase
    .from("user_details")
    .select("*")
    .eq("id", params.slug);
  const userCamera = data2?.[0];
  let { data: userReviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", params.slug);

  if (error) return <div>User not found!</div>;

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <span className="font-bold text-3xl">
          {user?.username} ({user?.ingamename})
        </span>
      </div>
      <Separator className="my-8" />
      <div className="flex gap-8 justify-evenly flex-wrap">
        <Card className="min-w-[30%]">
          <CardHeader>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Profile</span>
            </div>
            <Separator />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex space-x-2">
                <span className="font-bold">Username:</span>
                <span>{user?.username}</span>
              </div>
              {/* <div className="flex space-x-2">
                <span className="font-bold">Email:</span>
                <span>{user?.email}</span>
              </div> */}
              <div className="flex space-x-2">
                <span className="font-bold">In-game name:</span>
                <span>{user?.ingamename}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Camera Settings */}
        <Card className="min-w-[30%]">
          <CardHeader>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Camera Settings</span>
            </div>
            <Separator />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex space-x-2">
                <span className="font-bold">FOV:</span>
                <span>{userCamera?.fov || "-"}</span>
              </div>
              <div className="flex space-x-2">
                <span className="font-bold">Distance:</span>
                <span>{userCamera?.distance || "-"}</span>
              </div>
              <div className="flex space-x-2">
                <span className="font-bold">Height:</span>
                <span>{userCamera?.height || "-"}</span>
              </div>
              <div className="flex space-x-2">
                <span className="font-bold">Angle:</span>
                <span>{userCamera?.angle || "-"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Rank */}
        <Card className="min-w-[30%]">
          <CardHeader>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Details</span>
            </div>
            <Separator />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex space-x-2">
                <span className="font-bold">Current Rank:</span>
                <span>{userDetails?.current_rank || "-"}</span>
              </div>
              <div className="flex space-x-2">
                <span className="font-bold">Peak Rank:</span>
                <span>{userDetails?.peek_rank || "-"}</span>
              </div>
              <div className="flex space-x-2">
                <span className="font-bold">Availability:</span>
                <span>{userDetails?.availability || "-"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Separator className="my-4" />
      {/* Reviews */}
      <div>
        <div className="flex justify-between items-center">
          <span className="font-bold">Reviews:</span>
          <PostAReview id={params.slug} />
        </div>
        <div className="flex gap-4 mt-3">
          {userReviews?.map((review) => (
            <Card id={review.id}>
              <CardHeader>
                <Rating name="read-only" value={review.rating} readOnly />
                <Separator />
              </CardHeader>
              <CardContent>
                <span>{review.comment}</span>
              </CardContent>
            </Card>
          ))}
          {userReviews?.length === 0 && <span>No Reviews!</span>}
        </div>
      </div>
    </div>
  );
}
