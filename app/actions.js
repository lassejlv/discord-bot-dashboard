"use server";

import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import stripe from "stripe";
const stripeClient = stripe(process.env.STRIPE_SECRET);

const apiUrl = "https://discord.com/api/v10";

// Gets users guilds from discord api
export async function getUserGuilds(email) {
  // find user via email so we can get their access token
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return [];
  } else {
    try {
      // Fetch the discord api to get the bots guilds
      const botsGuildsResponse = await fetch(`${apiUrl}/users/@me/guilds`, {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_CLIENT_TOKEN}`,
        },
      });

      // The bots guilds
      const botGuilds = await botsGuildsResponse.json();
      if (!botsGuildsResponse.ok) {
        console.log(botsGuildsResponse);
        return [];
      } else {
        // Fetching Users Guilds
        const userGuildsResponse = await fetch(`${apiUrl}/users/@me/guilds`, {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        });

        if (!userGuildsResponse.ok) {
          console.log(userGuildsResponse);
          return [];
        } else {
          const userGuilds = await userGuildsResponse.json();
          if (!Array.isArray(userGuilds)) {
            console.log("Not an array");
            return [];
          } else {
            // Find guilds where user has admin perms
            const guilds = userGuilds.filter((guild) => guild.permissions & 8);

            // Update guilds with inGuild property, to make it easier to render
            const updatedGuilds = guilds.map((guild) => {
              const inGuild = botGuilds.some(
                (botGuild) => botGuild.id === guild.id
              );
              return { ...guild, inGuild };
            });

            // set users "guildIds" in database
            const updatedUser = await prisma.user.update({
              where: { email },
              data: {
                guildIds: {
                  set: updatedGuilds.map((guild) => guild.id),
                },
              },
            });

            console.log("User updated in database", updatedUser);

            return updatedGuilds;
          }
        }
      }

      return botGuilds;
    } catch (error) {
      return error.message;
    }
  }
}

// Get guild
export async function getGuild(guildId) {
  const prisma = new PrismaClient();
  const guild = await prisma.guild.findUnique({
    where: { guildId: guildId },
  });

  // fetch discord api to get guild info
  const guildResponse = await fetch(`${apiUrl}/guilds/${guildId}`, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_CLIENT_TOKEN}`,
    },
  });

  if (!guildResponse.ok) {
    console.log(guildResponse);
    return null;
  } else {
    const guildInfo = await guildResponse.json();
    console.log("Guild info", guildInfo);
    return guildInfo;
  }
}

// get user from database
export async function getUser(userEmail) {
  const prisma = new PrismaClient();

  if (typeof userEmail !== "string") return null;

  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  return user;
}

// create stripe subscription checkout
export async function createCheckoutSession(email, guildId, plan) {
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // create stripe checkout session
  const session = await stripeClient.checkout.sessions.create({
    payment_method_types: ["card"],
    allow_promotion_codes: true,
    line_items: [
      {
        price: process.env.STRIPE_PRO_ID,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/${guildId}/billing?canceled=true`,
    customer_email: email,
    client_reference_id: guildId,
  });

  return session;
}

export async function createBillingSession(email) {
  // Create a billing portal session
  const session = await stripeClient.billingPortal.sessions.create({
    customer: email,
    return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
  });

  console.log("Billing session", session);
  return session;
}
