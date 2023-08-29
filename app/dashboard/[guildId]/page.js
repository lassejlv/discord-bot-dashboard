import { getUser, getGuild } from "@/app/actions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function page({ params }) {
  const session = await getServerSession();
  const user = await getUser(session.user.email);
  const guild = await getGuild(params.guildId);
  console.log(getGuild);

  if (!user.guildIds.includes(params.guildId)) {
    return redirect("/?error=missing_permissions");
  } else if (!guild) {
    return redirect("/?error=not_found");
  }

  return (
    <>
      <div>Welcome back {guild?.name}</div>
    </>
  );
}
