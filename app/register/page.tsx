"use client";

export default function RegisterPage() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      company: formData.get("company"),
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6">Register</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            Name
            <input
              name="name"
              type="text"
              required
              className="border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 bg-white dark:bg-zinc-900"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            Email
            <input
              name="email"
              type="email"
              required
              className="border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 bg-white dark:bg-zinc-900"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            Phone
            <input
              name="phone"
              type="tel"
              required
              className="border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 bg-white dark:bg-zinc-900"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            Company <span className="text-zinc-500">(optional)</span>
            <input
              name="company"
              type="text"
              className="border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-2 bg-white dark:bg-zinc-900"
            />
          </label>

          <button
            type="submit"
            className="mt-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium py-2 px-4 rounded-md hover:opacity-90"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
