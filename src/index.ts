require('dotenv').config();
import app from './app';

const port = process.env.PORT || 4000;

app.listen(port || 4000, () => {
	console.log(`Server is running on port ${port}`);
});
