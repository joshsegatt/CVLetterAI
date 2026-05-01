import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
      <SignUp 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "rounded-3xl border-zinc-200 shadow-xl shadow-zinc-200/20",
            headerTitle: "text-2xl font-black text-zinc-900 tracking-tight",
            headerSubtitle: "text-zinc-500 font-medium",
            socialButtonsBlockButton: "rounded-xl border-zinc-200 hover:bg-zinc-50 transition-all",
            formButtonPrimary: "bg-zinc-950 hover:bg-zinc-800 rounded-xl transition-all h-11 text-sm font-bold",
            formFieldInput: "rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-0",
            footerActionLink: "text-zinc-900 font-bold hover:text-zinc-700"
          }
        }}
        signInUrl="/sign-in"
      />
    </div>
  );
}
