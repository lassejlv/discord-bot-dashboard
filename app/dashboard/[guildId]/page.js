import { PrismaClient } from "@prisma/client";
import { getUser, getGuild } from "@/app/actions";
import SideBar from "@/app/components/Sidebar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function page({ params }) {
  const prisma = new PrismaClient();
  const session = await getServerSession();
  const user = await getUser(session.user.email);
  const guild = await getGuild(params.guildId);
  // Finding Guild in Database
  const guildFromDatabase = await prisma.guild.findUnique({
    where: { guildId: params.guildId },
  });
  // If not found, create it
  if (!guildFromDatabase) {
    await prisma.guild.create({
      data: {
        guildId: params.guildId,
        ownerId: guild?.owner_id ?? null,
      },
    });

    console.log(`Created guild ${params.guildId}`);
  }

  if (!user.guildIds.includes(params.guildId)) {
    return redirect("/?error=missing_permissions");
  } else if (!guild) {
    return redirect(
      `/dashboard/${params.guildId}/invite?error=guild_not_found`
    );
  }

  return (
    <>
      <SideBar guild={guild}>
        <div>
          <h1>
            Welcome back, <span className="font-bold">{session.user.name}</span>
            !
          </h1>
        </div>
      </SideBar>
    </>
  );
}
