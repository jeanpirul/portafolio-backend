require('dotenv').config();
import app from './app';

const port = process.env.PORT || 4000;

console.log(`Server listening on port ${port}`);

app.listen({ port });
