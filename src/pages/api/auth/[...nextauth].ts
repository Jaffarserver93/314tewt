
import NextAuth, { type NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { supabase } from '@/lib/supabase';

export const authOptions: NextAuthOptions = {
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

            if (response.ok) {
              console.log(`Successfully handled user ${userId} for guild ${guildId}. Status: ${response.status}`);
            } else {
              const errorText = await response.text();
              console.error(`Failed to add user ${userId} to guild ${guildId}. Status: ${response.status}`, errorText);
            }
          }
        } catch (error) {
          console.error('Error adding user to Discord guild:', error);
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // After a successful sign-in, we want to ensure user data is saved.
      // We check if the redirect URL is the base URL (i.e., home page).
      // If it is, we redirect to '/save-data' to trigger the data saving process.
      const homeUrl = new URL("/", baseUrl);
      const redirectUrl = new URL(url, baseUrl);

      if (redirectUrl.pathname === homeUrl.pathname && redirectUrl.search === "") {
        return `${baseUrl}/save-data`;
      }

      // For all other cases (e.g., sign-out, or specific redirects), use the default URL.
      return url;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.id = (profile as any).id;
        token.profile = profile;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.profile) {
          (session.user as any) = {
            ...((token.profile as any) ?? {}),
            ...session.user,
          };
      }
      if (token.id) {
        const userId = token.id as string;
        (session.user as any).id = userId;

        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', userId)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
          console.error('Error fetching user role from Supabase:', error);
        } else if (userData) {
          (session.user as any).role = userData.role;
        } else {
          (session.user as any).role = 'user'; // Default role for new users
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
