export async function GET() {
  return Response.json({
    secret: process.env.SECRET_MESSAGE,
  });
}
