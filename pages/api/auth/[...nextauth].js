import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

console.log("🚀 DEBUG: GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("🚀 DEBUG: GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
console.log("🚀 DEBUG: NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("🚀 DEBUG: NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET);

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enables debug mode to see logs in terminal
});
