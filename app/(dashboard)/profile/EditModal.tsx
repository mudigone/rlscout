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
const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  username: z.string().min(4, {
    message: "Username must be at least 4 characters.",
  }),
  ingamename: z.string().refine((value) => !!value, {
    message: "required.",
  }),
});

interface User {
  email: string;
  ingamename: string;
  username: string;
  id: string;
}

interface EditModalProps {
  user: User;
}

const EditModal: React.FC<EditModalProps> = ({ user }) => {
  const { setUser } = useContext(UserContext);

  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user.email || "",
      ingamename: user.ingamename || "",
      username: user.username || "",
    },
  });

  const handleSubmit = async (data: User) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("users")
        .update({ username: data.username, ingamename: data.ingamename })
        .eq("id", user.id);

      toast({
        description: "Profile updated successfully",
      });
      setUser((prev: User) => ({
        ...prev,
        username: data.username,
        ingamename: data.ingamename,
      }));
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john@doe.com" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="e.g: John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ingamename"
          render={({ field }) => (
            <FormItem>
              <FormLabel>In Game Name</FormLabel>
              <FormControl>
                <Input placeholder="imposter11" {...field} />
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

export default EditModal;
