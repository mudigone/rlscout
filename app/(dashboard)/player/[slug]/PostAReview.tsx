"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import supabase from "@/lib/db";
import { useContext, useEffect, useState } from "react";
import { FormControl, FormLabel, Rating } from "@mui/material";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";
import { UserContext } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  comment: z.string().min(1, { message: "Please write some comments" }),
});

const PostAReview = ({ id }: { id: string }) => {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const { toast } = useToast();

  const [reviewPosted, setReviewPosted] = useState(false);
  const [rating, setRating] = useState(1);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  useEffect(() => {
    const checkReviewPosted = async () => {
      let { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("by_userid", user.id)
        .eq("id", id);
      console.log(data);
      if (data?.length) setReviewPosted(true);
    };

    checkReviewPosted();
  });

  let handleSubmit = async (data: { comment: string }) => {
    // write to supabase
    if (!rating) return alert("Please select a rating");
    if (user.id === id) return alert("You cannot review yourself");
    let { data: response, error } = await supabase.from("reviews").insert({
      id,
      comment: data.comment,
      rating: rating,
      by_userid: user.id,
    });
    router.refresh();
    form.reset();
    toast({
      title: "Review posted",
      description: "Your review has been posted",
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button size="sm">Post A Review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Post a review</DialogTitle>
        </DialogHeader>
        <Separator />
        <div>
          {reviewPosted ? (
            <span>You have posted for this player.</span>
          ) : (
            <Form {...form}>
              <form
                className="flex flex-col items-end"
                onSubmit={form.handleSubmit(handleSubmit)}
              >
                <div className="flex w-full justify-between ">
                  <label
                    htmlFor="rating"
                    className="self-start text-foreground"
                  >
                    Rating
                  </label>
                  <Rating
                    name="simple-controlled"
                    defaultValue={rating}
                    onChange={(event, newValue) => {
                      setRating(newValue || 0);
                    }}
                  />
                </div>
                <div className="w-full flex">
                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            className="mt-2 w-full"
                            placeholder="Write your comments here..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  size="sm"
                  disabled={
                    form.formState.isSubmitting || !form.formState.isDirty
                  }
                >
                  Submit
                </Button>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostAReview;
