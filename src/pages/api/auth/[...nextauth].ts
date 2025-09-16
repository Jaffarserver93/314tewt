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
      if (account && profile) {
        try {
          const guildId = process.env.DISCORD_GUILD_ID;
          const botToken = process.env.DISCORD_BOT_TOKEN;
          
          if (guildId && botToken && account.access_token) {
            const response = await fetch(`https://discord.com/api/guilds/${guildId}/members/${profile.id}`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bot ${botToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                access_token: account.access_token,
              }),
            });
            
            // 201 means user was added, 204 means user was already in guild.
            // Anything else is an error we should probably log, but not block login for.
            if (!response.ok && ![201, 204].includes(response.status)) { 
              const errorText = await response.text();
              console.error('Failed to add user to guild:', response.status, errorText);
            }
          }
        } catch (error) {
          console.error('Error adding user to guild:', error);
          // We don't want to block login if the guild join fails
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
        token.id = profile.id; // profile.id is the user's Discord ID
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
