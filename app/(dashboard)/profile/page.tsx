"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserContext } from "@/providers/UserProvider";
import { useContext, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { MdEditSquare } from "react-icons/md";
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import EditModal from "./EditModal";
import supabase from "@/lib/db";
import EditCameraModal from "./EditCameraModal";
import EditDetailsModal from "./EditDetailsModal";
export type UserCamera = {
  fov: string;
  distance: string;
  height: string;
  angle: string;
};
export type UserDetails = {
  current_rank: string;
  peek_rank: string;
  availability: string;
};
const Profile = () => {
  const { user } = useContext(UserContext);
  const [userCamera, setUserCamera] = useState<UserCamera>({
    fov: "",
    distance: "",
    height: "",
    angle: "",
  });
  const [userDetails, setUserDetails] = useState<UserDetails>({
    current_rank: "",
    peek_rank: "",
    availability: "",
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      // fetch data from user_camera with user.id
      const { data, error } = await supabase
        .from("user_camera")
        .select("*")
        .eq("id", user.id);
      if (data?.length) setUserCamera(data[0]);
      const { data: details, error: e } = await supabase
        .from("user_details")
        .select("*")
        .eq("id", user.id);
      if (details?.length) setUserDetails(details[0]);
    };
    fetchUserDetails();
  }, []);

  const handleCameraUpdates = (updates: UserCamera) => {
    setUserCamera((prev) => ({ ...prev, ...updates }));
  };

  const handleDetailsUpdates = (updates: UserDetails) => {
    setUserDetails((prev) => ({ ...prev, ...updates }));
  };

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

              <Dialog>
                <DialogTrigger asChild>
                  <MdEditSquare
                    size={20}
                    className="hover:text-gray-500 cursor-pointer"
                  />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit User Details</DialogTitle>
                  </DialogHeader>
                  <Separator />
                  <EditModal {...{ user }} />
                </DialogContent>
              </Dialog>
            </div>
            <Separator />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex space-x-2">
                <span className="font-bold">Username:</span>
                <span>{user?.username}</span>
              </div>
              <div className="flex space-x-2">
                <span className="font-bold">Email:</span>
                <span>{user?.email}</span>
              </div>
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

              <Dialog>
                <DialogTrigger>
                  <MdEditSquare
                    size={20}
                    className="hover:text-gray-500 cursor-pointer"
                  />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Camera Settings</DialogTitle>
                  </DialogHeader>
                  <Separator />
                  <EditCameraModal
                    id={user.id}
                    {...{ userCamera, handleCameraUpdates }}
                  />
                </DialogContent>
              </Dialog>
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
              <Dialog>
                <DialogTrigger asChild>
                  <MdEditSquare
                    size={20}
                    className="hover:text-gray-500 cursor-pointer"
                  />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Details</DialogTitle>
                  </DialogHeader>
                  <Separator />
                  <EditDetailsModal
                    id={user.id}
                    {...{ userDetails,handleDetailsUpdates }}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <Separator />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex space-x-2">
                <span className="font-bold">Current Rank:</span>
                <span>{userDetails.current_rank || "-"}</span>
              </div>
              <div className="flex space-x-2">
                <span className="font-bold">Peak Rank:</span>
                <span>{userDetails.peek_rank || "-"}</span>
              </div>
              <div className="flex space-x-2">
                <span className="font-bold">Availability:</span>
                <span>{userDetails.availability || "-"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
