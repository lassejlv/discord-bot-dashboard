"use client";

import React from "react";

const dotdotLoadingAnimation = (
  <div className="flex flex-row items-center justify-center">
    <div className="w-3 h-3 bg-gray-500 rounded-full mr-1 animate-bounce"></div>
    <div className="w-3 h-3 bg-gray-500 rounded-full mr-1 animate-bounce200"></div>
    <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce400"></div>
  </div>
);

export default function page({ params }) {
  React.useEffect(() => {
    setTimeout(() => {
      window.location.replace(
        `https://discord.com/oauth2/authorize?client_id=1101580219908903053&permissions=8&scope=bot&guild_id=${params.guildId}&disable_guild_select=true`
      );
    }, 1000);
  });
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        You about to invite the bot <dotdotLoadingAnimation />
      </div>
    </>
  );
}
