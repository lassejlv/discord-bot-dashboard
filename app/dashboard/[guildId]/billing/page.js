import { PrismaClient } from "@prisma/client";
import { getUser, getGuild } from "@/app/actions";
import SideBar from "@/app/components/Sidebar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Billing from "@/app/components/Billing";

export default async function page({ params }) {
  const prisma = new PrismaClient();
  const session = await getServerSession();
  const user = await getUser(session.user.email);
  const guild = await getGuild(params.guildId);
  const userFromDatabase = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  const guildFromDatabase = await prisma.guild.findUnique({
    where: { guildId: params.guildId },
  });

  if (!user.guildIds.includes(params.guildId)) {
    return redirect("/?error=missing_permissions");
  } else if (!guild) {
    return redirect(
      `/dashboard/${params.guildId}/invite?error=guild_not_found`
    );
  } else if (!guildFromDatabase) {
    return redirect(`/?error=missing_permissions`);
  } else if (!guildFromDatabase.ownerId === userFromDatabase.discordId) {
    return redirect(`/?error=missing_permissions`);
  }

  return (
    <>
      <SideBar guild={guild}>
        <Billing guild={guildFromDatabase} />
      </SideBar>
    </>
  );
}
