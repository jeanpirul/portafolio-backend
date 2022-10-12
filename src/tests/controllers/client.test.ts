import { connectDB } from "../../config/config";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  const defaultConnection = getConnection("default");
  await defaultConnection.close();
});
