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
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.profile = profile;

        try {
          const guildId = process.env.DISCORD_GUILD_ID;
          const botToken = process.env.DISCORD_BOT_TOKEN;
          
          if (guildId && botToken) {
            await fetch(`https://discord.com/api/guilds/${guildId}/members/${profile.id}`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bot ${botToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                access_token: account.access_token,
              }),
            });
          }
        } catch (error) {
          console.error('Failed to add user to guild:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        ...((token.profile as any) ?? {}),
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
