"use client";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { getUserGuilds } from "./actions";

export default function Home() {
  const { data: session } = useSession();
  const [loading, setLoading] = React.useState(false);
  const [guilds, setGuilds] = React.useState([]);

  React.useEffect(() => {
    if (session) {
      setLoading(true);
      getUserGuilds(session.user.email).then((guilds) => {
        setTimeout(() => {
          setGuilds(guilds);
          setLoading(false);
        }, 1000);
      });
    }
  }, [session]);

  return (
    <>
      {session ? (
        <>
          Logged in as {session?.user?.email} <br />
          {loading ? (
            <>Loading...</>
          ) : (
            <>
              {guilds?.map((guild) => (
                <div key={guild.id}>
                  <img
                    src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}?size=64`}
                  />
                  {guild.name} - {guild.inGuild ? "In Guild" : "Not In Guild"}
                  <a
                    href={
                      guild.inGuild
                        ? `/dashboard/${guild.id}`
                        : `https://discord.com/api/oauth2/authorize?client_id=1101580219908903053&permissions=8&scope=bot&guild_id=${guild.id}&response_type=code&disable_guild_select=true`
                    }
                  >
                    View
                  </a>
                </div>
              ))}
            </>
          )}
        </>
      ) : (
        <>
          Not signed in <br />
          <button onClick={() => signIn("discord")}>Sign in</button>
        </>
      )}
    </>
  );
}
