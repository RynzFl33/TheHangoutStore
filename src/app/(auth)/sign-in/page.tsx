import { SignInForm } from "./sign-in-form";

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string; error?: string; message?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  
  const message = params.success
    ? { success: params.success }
    : params.error
    ? { error: params.error }
    : params.message
    ? { message: params.message }
    : undefined;

  return <SignInForm message={message} />;
}
