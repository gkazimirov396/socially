'use client';

import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';

import { updateProfile } from '@/actions/profile.action';

import {
  UpdateProfileInput,
  UpdateProfileSchema,
} from '@/schema/profile.schema';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import type { User } from '@/types/user';

interface UpdateProfileFormProps {
  user: NonNullable<User>;
  showEditDialog: boolean;
  setShowEditDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UpdateProfileForm({
  user,
  showEditDialog,
  setShowEditDialog,
}: UpdateProfileFormProps) {
  const form = useForm<UpdateProfileInput>({
    mode: 'onBlur',
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: user.name || '',
      bio: user.bio || '',
      location: user.location || '',
      website: user.website || '',
    },
  });

  const handleEditSubmit: SubmitHandler<UpdateProfileInput> = async values => {
    const result = await updateProfile(values);

    if (result.success) {
      setShowEditDialog(false);
      toast.success('Profile updated successfully');
    }
  };

  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <Form {...form}>
        <form>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Name</FormLabel>

                    <FormControl>
                      <Input placeholder="Your name" type="text" {...field} />
                    </FormControl>

                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="bio"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Bio</FormLabel>

                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself"
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>

                    <FormDescription>
                      Briefly describe yourself in a few words.
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="location"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Location</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Where are you based?"
                        type="text"
                        {...field}
                      />
                    </FormControl>

                    <FormDescription>
                      What city or country are you based in?
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="website"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Website</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Your personal website"
                        type="url"
                        {...field}
                      />
                    </FormControl>

                    <FormDescription>
                      Do you have a personal website or portfolio?
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <Button
                type="submit"
                onClick={form.handleSubmit(handleEditSubmit)}
                disabled={
                  !form.formState.isDirty || form.formState.isSubmitting
                }
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}
