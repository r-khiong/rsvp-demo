import { redirect } from "next/navigation";

// The product entry point is the registration form. The root path simply
// forwards there until a dedicated landing page is built (Block 7).
export default function Home() {
  redirect("/register");
}
