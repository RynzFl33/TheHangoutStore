import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signUpAction } from "@/app/actions";
import Navbar from "@/components/navbar";
import { UrlProvider } from "@/components/url-provider";
import { OAuthButtons } from "@/components/oauth-buttons";
import { SmtpMessage } from "../smtp-message";

export default async function Signup(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#F8FAFC] to-[#E8F0F2] dark:from-[#001A1A] dark:to-[#002626] px-4 py-8">
        <div className="w-full max-w-md rounded-xl border border-[#BDCDCF] bg-[#F8FAFC] dark:bg-[#002626] shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#034C36] to-[#026548] p-5 text-white">
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Create Account</h1>
            </div>
          </div>

          <div className="p-6">
            <UrlProvider>
              <form className="flex flex-col space-y-6">
                <div className="space-y-2 text-center pt-2">
                  <h2 className="text-2xl font-bold text-[#003332] dark:text-[#BDCDCF]">Join Our Community</h2>
                  <p className="text-sm text-[#5A6C72] dark:text-[#9CB0B3]">
                    Already have an account?{" "}
                    <Link
                      className="text-[#034C36] font-medium hover:text-[#013829] dark:text-[#4AE0B8] dark:hover:text-[#3BC9A5] transition-all"
                      href="/sign-in"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="full_name"
                      className="text-sm font-medium text-[#003332] dark:text-[#BDCDCF]"
                    >
                      Full Name
                    </Label>
                    <div className="relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 absolute left-3 top-3 text-[#5A6C72]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <Input
                        id="full_name"
                        name="full_name"
                        type="text"
                        placeholder="John Doe"
                        required
                        className="w-full pl-10 border-[#BDCDCF] focus:ring-2 focus:ring-[#034C36] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-[#003332] dark:text-[#BDCDCF]"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 absolute left-3 top-3 text-[#5A6C72]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        className="w-full pl-10 border-[#BDCDCF] focus:ring-2 focus:ring-[#034C36] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-[#003332] dark:text-[#BDCDCF]"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 absolute left-3 top-3 text-[#5A6C72]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <Input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="At least 6 characters"
                        minLength={6}
                        required
                        className="w-full pl-10 border-[#BDCDCF] focus:ring-2 focus:ring-[#034C36] focus:border-transparent"
                      />
                    </div>
                    <p className="text-xs text-[#5A6C72] dark:text-[#9CB0B3] mt-1">
                      Use at least 6 characters with a mix of letters and numbers
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      required
                      className="w-4 h-4 text-[#034C36] bg-gray-100 border-[#BDCDCF] rounded focus:ring-[#034C36]"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="terms"
                      className="text-[#5A6C72] dark:text-[#9CB0B3]"
                    >
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-[#034C36] hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-[#034C36] hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>

                <SubmitButton
                  formAction={signUpAction}
                  pendingText="Creating account..."
                  className="w-full bg-gradient-to-r from-[#034C36] to-[#026548] hover:from-[#013829] hover:to-[#013829] text-white font-medium py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  Create Account
                </SubmitButton>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#BDCDCF]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[#F8FAFC] dark:bg-[#002626] text-[#5A6C72] dark:text-[#9CB0B3]">
                      Or sign up with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <OAuthButtons />
                </div>

                <FormMessage message={searchParams} />
              </form>
            </UrlProvider>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-8 opacity-70">
          <div className="bg-[#034C36] w-10 h-10 rounded-full"></div>
          <div className="bg-[#BDCDCF] w-12 h-12 rounded-full"></div>
          <div className="bg-[#003332] w-8 h-8 rounded-full"></div>
        </div>

        <SmtpMessage />
      </div>
    </>
  );
}
