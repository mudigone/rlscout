import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import supabase from "@/lib/db";
import { UserContext } from "@/providers/UserProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserDetails } from "./page";
// All required
const formSchema = z.object({
  current_rank: z.string().min(1, { message: "required" }),
  peek_rank: z.string().min(1, { message: "required" }),
  availability: z.string().min(1, { message: "required" }),
});

interface EditDetailsProps {
  userDetails: UserDetails;
  id: string;
  handleDetailsUpdates: (updates: UserDetails) => void;
}

const EditDetailsModal: React.FC<EditDetailsProps> = ({
  userDetails,
  id,
  handleDetailsUpdates,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: userDetails,
  });

  const handleSubmit = async (data: UserDetails) => {
    try {
      setLoading(true);
      const { data: resp, error } = await supabase
        .from("user_details")
        .upsert({ id, ...data });
      if (!error) {
        toast({ description: "Details updated successfully!" });
        handleDetailsUpdates(data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  return (
    <Form {...form}>
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="current_rank"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Rank</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="peek_rank"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peak Rank</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Availability</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            size="sm"
            disabled={loading || !form.formState.isDirty}
            type="submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditDetailsModal;
