// import { Controller } from "react-hook-form";
// import { Input } from "@/shared/ui/Input/Input";
// import { Stack } from "@/shared/ui/Stack";
// import { Button } from "@/shared/ui/Button";
// import { UploadImage } from "@/shared/ui/UploadImage";
import styles from "./ContactsForm.module.scss";
// import { Typography } from "@/shared/ui/Typography";

export const ContactsForm = ({ form, onSubmit, isSubmitting }) => {
 // const { control, register, handleSubmit, formState: { errors }} = form;

  return (
    
    <form onSubmit={handleSubmit(onSubmit)} className={styles.inputForm}>
      {/* <Controller
        name="images"
        control={control}
        defaultValue={[]}
        render={({ field, fieldState: { error } }) => (
          <Stack direction="column" gap={8}>
            <UploadImage
              value={field.value}
              onChange={field.onChange}
              expandWhenEmpty
              maxFiles={1}
              great
            />

            {error && (
              <Typography type="span" size="xxs" className={styles.errorMessage}>
                {error.message}
              </Typography>
            )}
          </Stack>
        )}
      />

      <Stack direction="column" gap={8}>
        <Input
          label="Email"
          placeholder="Type here ..."
          {...register("email")}
        />


        {errors.email && (
          <Typography
            type="span"
            size="xxs"
            className={styles.errorMessage}
          >
            {errors.email.message}
          </Typography>
        )}
      </Stack>



      <Stack direction="column" gap={8}>
        <Input
          label="Phone Number"
          placeholder="Type here ..."
          type="tel"
          {...register("phone")}
        />

        {errors.phone && (
          <Typography
            type="span"
            size="xxs"
            className={styles.errorMessage}
          >
            {errors.phone.message}
          </Typography>
        )}
      </Stack>

      <Stack direction="column" gap={8}>
        <Input
          label="Facebook Link"
          placeholder="Type here ..."
          {...register("facebook")}
        />

        {errors.facebook && (
          <Typography
            type="span"
            size="xxs"
            className={styles.errorMessage}
          >
            {errors.facebook.message}
          </Typography>
        )}
      </Stack>

      <Stack direction="column" gap={8}>
        <Input
          label="Instagram Link"
          placeholder="Type here ..."
          {...register("instagram")}
        />

        {errors.instagram && (
          <Typography
            type="span"
            size="xxs"
            className={styles.errorMessage}
          >
            {errors.instagram.message}
          </Typography>
        )}
      </Stack>

      <Stack justify="center">
        <Button
          size="sm"
          variant="primary"
          type="submit"
          isLoading={isSubmitting}        
        >
          Submit
        </Button>
      </Stack> */}
    </form>
    
  );
};