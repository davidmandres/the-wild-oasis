import { FieldValues, useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import useSignUp from "./useSignUp.hooks";

// Email regex: /\S+@\S+\.\S+/

export default function SignUpForm() {
  const [signUp, isSigningUp] = useSignUp();
  const { register, formState, getValues, handleSubmit, reset } = useForm();
  const { errors } = formState;

  const requiredObj = { required: "This field is required" };

  function onSubmit({ fullName, email, password }: FieldValues) {
    signUp(
      { fullName, email, password },
      {
        onSettled() {
          reset();
        },
      }
    );
  }

  return (
    <Form type="regular" onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        type="horizontal"
        label="Full name"
        error={errors?.fullName?.message as string | undefined}
      >
        <Input
          type="text"
          id="fullName"
          disabled={isSigningUp}
          {...register("fullName", requiredObj)}
        />
      </FormRow>

      <FormRow
        type="horizontal"
        label="Email address"
        error={errors?.email?.message as string | undefined}
      >
        <Input
          type="email"
          id="email"
          disabled={isSigningUp}
          {...register("email", {
            ...requiredObj,
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address",
            },
          })}
        />
      </FormRow>

      <FormRow
        type="horizontal"
        label="Password (min 8 characters)"
        error={errors?.password?.message as string | undefined}
      >
        <Input
          type="password"
          id="password"
          disabled={isSigningUp}
          {...register("password", {
            ...requiredObj,
            minLength: {
              value: 8,
              message: "Password needs a minimum of 8 characters",
            },
          })}
        />
      </FormRow>

      <FormRow
        type="horizontal"
        label="Repeat password"
        error={errors?.passwordConfirm?.message as string | undefined}
      >
        <Input
          type="password"
          id="passwordConfirm"
          disabled={isSigningUp}
          {...register("passwordConfirm", {
            ...requiredObj,
            validate(value) {
              return (
                value === getValues().password || "Passwords need to match"
              );
            },
          })}
        />
      </FormRow>

      <FormRow type="horizontal">
        {/* type is an HTML attribute! */}
        <Button
          variation="secondary"
          size="medium"
          type="reset"
          onClick={reset}
          disabled={isSigningUp}
        >
          Cancel
        </Button>
        <Button variation="primary" size="medium" disabled={isSigningUp}>
          Create new user
        </Button>
      </FormRow>
    </Form>
  );
}
