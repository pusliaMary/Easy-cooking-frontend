import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactsForm } from "../RecipesForm/RecipesForm";
import { contactsZodSchema } from "@/entities/contact";
import { Skeleton } from "@/shared/ui/Skeleton";
import { Stack } from "@/shared/ui/Stack";
import { useEffect } from "react";
import {
  useGetRecipesQuery,
  useSaveRecipeMutation,
  useDeleteRecipeMutation,
  useEditRecipeMutation,
} from "@/entities/recipes";

const defaultValues = (initialData) => ({
  email: initialData?.email || "",
  phone: initialData?.phone?.toString() || "",
  facebook: initialData?.facebook?.toString() || "",
  instagram: initialData?.instagram?.toString() || "",
  images: initialData?.image ? [{ preview: initialData.image.src }] : [],
});

export const RecipesAdmin = () => {
  const { data, isLoading, error } = useGetContactsQuery();
  const [createContact, { isLoading: isCreating }] = useCreateContactMutation();
  const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation();

  const initialData = data;

  const form = useForm({
    resolver: zodResolver(contactsZodSchema),
    mode: "onSubmit",
    defaultValues: defaultValues(initialData),
  });

  useEffect(() => {
    if (initialData) {
      form.reset(defaultValues(initialData));
    }
  }, [initialData, form]);

  const onSubmit = async (formData) => {
    try {
      const data = new FormData();

      const file = formData.images?.[0]?.file;
      if (file) {
        data.append("image", file);
      }

      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("facebook", formData.facebook);
      data.append("instagram", formData.instagram);

      if (initialData) {
        await updateContact(data).unwrap();
        toast.success("Contacts updated successfully");
      } else {
        await createContact(data).unwrap();
        toast.success("Contacts added successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while saving contacts");
    }
  };

  if (error) {
    return <div>Error loading data</div>;
  }

  if (isLoading) {
    return (
      <Stack direction="column" gap="40" max>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} height="20vh" />
        ))}
      </Stack>
    );
  }

  return (
    <ContactsForm
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isCreating || isUpdating}
    />
  );
};
