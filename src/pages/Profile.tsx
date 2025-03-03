import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProfile, updateProfile } from "@/api/profile.service";
import { IProfile } from "@/types";

const formSchema = z.object({
  name: z.string().min(3),
});

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    created_at: string;
  }>({
    name: "",
    email: "",
    created_at: "",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await getProfile();
      if (response.status) {
        const data: IProfile = response.data;
        setProfile({
          name: data.name,
          email: data.email,
          created_at: new Date(data.created_at).toDateString(),
        });
        form.reset({
          name: data.name,
        }); // Pre populate the form with map data
      }
    };
    fetchProfile();
  }, []);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const result = await updateProfile(data);
    if (result.status) {
      navigate("/");
    }
  }

  return (
    <div className="flex h-full justify-center items-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Edit Profile</h1>
        <div className="mb-4 flex items-center justify-between bg-gray-100 rounded-md p-2">
          <div className="text-sm mr-2 text-right font-bold text-gray-500">
            <p>{profile.email}</p>
            <p>Registered On {profile.created_at}</p>
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-1 md:col-span-2 flex justify-end gap-2">
              <Button type="submit" className="w-full md:w-auto px-8">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Profile;
