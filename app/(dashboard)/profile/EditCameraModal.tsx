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
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserCamera } from "./page";
const formSchema = z.object({
  fov: z.string().min(1, { message: "required" }),
  distance: z.string().min(1, { message: "required" }),
  height: z.string().min(1, { message: "required" }),
  angle: z.string().min(1, { message: "required" }),
});

interface EditCameraModal {
  userCamera: UserCamera;
  id: string;
  handleCameraUpdates: (updates: UserCamera) => void;
}

const EditCameraModal: React.FC<EditCameraModal> = ({
  id,
  userCamera,
  handleCameraUpdates,
}) => {
  //   console.log(userCamera);
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: userCamera,
  });

  const handleSubmit = async (data: any) => {
    // console.log(data);
    try {
      setLoading(true);
      const { data: resp, error } = await supabase
        .from("user_camera")
        .upsert({ id, ...data });
      if (!error) {
        toast({ description: "Camera details updated successfully!" });
        handleCameraUpdates(data);
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
          name="fov"
          render={({ field }) => (
            <FormItem>
              <FormLabel>FOV</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="distance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Distance</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="angle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Angle</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button size="sm" disabled={loading || !form.formState.isDirty}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditCameraModal;
