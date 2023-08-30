import NextAuth from "next-auth/next";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaClient } from "@prisma/client";

const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: "identify email guilds" } },
    }),
  ],

  callbacks: {
    async signIn(user, account, profile) {
      const prisma = new PrismaClient();

      const checkUser = await prisma.user.findUnique({
        where: { discordId: user?.profile?.id },
      });

      // check user
      if (checkUser) {
        // update user in database
        const updatedUser = await prisma.user.update({
          where: { discordId: user?.profile?.id },
          data: {
            username: user?.profile?.username,
            accessToken: user?.account?.access_token,
            refreshToken: user?.account?.refresh_token,
          },
        });

        console.log("here is tokenRTTT" + user?.account?.access_token);
        console.log("User updated in database");
      } else {
        // create user in database
        const newUser = await prisma.user.create({
          data: {
            discordId: user?.profile?.id,
            username: user?.profile?.username,
            avatar: user?.profile?.avatar,
            email: user?.profile?.email,
            accessToken: user?.account?.access_token,
            refreshToken: user?.account?.refresh_token,
          },
        });

        console.log("User created in database");
      }

      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
