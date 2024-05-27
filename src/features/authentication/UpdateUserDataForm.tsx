import { useState } from "react";

import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import useUser from "./useUser.hooks";
import { User } from "@supabase/supabase-js";
import useUpdateUser from "./useUpdateUser.hooks";

function UpdateUserDataForm() {
  // We don't need the loading state, and can immediately use the user data, because we know that it has already been loaded at this point
  const [user] = useUser();

  const {
    email,
    user_metadata: { fullName: currentFullName },
  } = user as User;

  const [updateUser, isUpdating] = useUpdateUser();
  const [fullName, setFullName] = useState(currentFullName);
  const [avatar, setAvatar] = useState<File | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fullName) return;
    updateUser(
      { fullName, avatar },
      {
        onSuccess() {
          setAvatar(null);
        },
      }
    );
  }

  function handleCancel() {
    setFullName(currentFullName);
    setAvatar(null);
  }

  return (
    <Form type="regular" onSubmit={handleSubmit}>
      <FormRow type="horizontal" label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow type="horizontal" label="Full name">
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          id="fullName"
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow type="horizontal" label="Avatar image">
        <FileInput
          id="avatar"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files?.item(0) as File | null)}
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow type="horizontal">
        <Button
          type="reset"
          variation="secondary"
          size="medium"
          onClick={handleCancel}
          disabled={isUpdating}
        >
          Cancel
        </Button>
        <Button variation="primary" size="medium" disabled={isUpdating}>
          Update account
        </Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
