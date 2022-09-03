require('dotenv').config();
import app from './app';
import { connectDB } from './config/config';
import { DBNAME } from './environment';

const port = process.env.PORT || 4000;

const main = async () => {
	console.log("entra al try");
	try {
		await connectDB.initialize();
		console.log(`BASE DE DATOS CONECTADA A: ${DBNAME} `);
	} catch (error: any) {
		console.log(`ERROR BASE DE DATOS: ${error.message}`);
	}
};
app.listen(port || 4000, () => {
	console.log(`Server is running on port ${port}`);
});


main()