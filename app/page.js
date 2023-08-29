"use client";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { getUserGuilds } from "./actions";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const [loading, setLoading] = React.useState(false);
  const [guilds, setGuilds] = React.useState([]);
  const router = useRouter();

  React.useEffect(() => {
    if (session) {
      setLoading(true);
      getUserGuilds(session.user.email).then((guilds) => {
        setTimeout(() => {
          setGuilds(guilds);
          console.log(guilds);
          setLoading(false);
        }, 1000);
      });
    }
  }, [session]);

  const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  return (
    <>
      {session ? (
        <>
          Logged in as {session?.user?.email} <br />
          {loading ? (
            <>Loading...</>
          ) : (
            <>
              <div
                className="grid gap-4 m-3"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                }}
              >
                {guilds?.map((guild) => (
                  <>
                    <article
                      onClick={() => {
                        guild?.inGuild
                          ? router.push(`/dashboard/${guild.id}`)
                          : router.push(`/dashboard/${guild.id}/invite`);
                      }}
                      key={guild.id}
                      className="overflow-hidden rounded-lg shadow-lg cursor-pointer hover:shadow-2xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                    >
                      <Image
                        src={
                          guild?.icon !== null
                            ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}?size=256`
                            : `https://cdn.discordapp.com/embed/avatars/${
                                randomNumber(0, 5) + 1
                              }.png`
                        }
                        alt="guild icon"
                        width={200}
                        height={200}
                      />
                    </article>
                  </>
                ))}
              </div>
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
