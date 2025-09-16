import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: 'identify email guilds.join' } },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account && profile && account.provider === 'discord') {
        try {
          const guildId = process.env.DISCORD_GUILD_ID;
          const botToken = process.env.DISCORD_BOT_TOKEN;
          const userId = (profile as any).id;

          if (guildId && botToken && account.access_token) {
            const response = await fetch(`https://discord.com/api/guilds/${guildId}/members/${userId}`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bot ${botToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                access_token: account.access_token,
              }),
            });

            // Status 201: user was added to the guild.
            // Status 204: user was already in the guild.
            if (response.ok) {
              console.log(`Successfully handled user ${userId} for guild ${guildId}. Status: ${response.status}`);
            } else {
              const errorText = await response.text();
              console.error(`Failed to add user ${userId} to guild ${guildId}. Status: ${response.status}`, errorText);
            }
          }
        } catch (error) {
          console.error('Error adding user to Discord guild:', error);
          // Do not block sign-in if the guild join fails.
        }
      }
      return true; // Allow the sign-in to proceed
    },
    async redirect({ url, baseUrl }) {
      // After a successful sign-in, redirect to the save-data page.
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/save-data`;
      }
      // Allows redirecting to external URLs
      return url;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.id = (profile as any).id; // profile.id is the user's Discord ID
        token.profile = profile;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.profile) {
          session.user = {
            ...session.user,
            ...((token.profile as any) ?? {}),
          };
      }
      if (token.id) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
