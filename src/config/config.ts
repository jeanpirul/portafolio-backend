import { createConnection } from 'typeorm';
import { DBOPTIONS } from '../environment';

export const connectDB = async () => {
	try {
		const { DBHOST, DBNAME, DBPASS, DBUSER } = DBOPTIONS;
		await createConnection({
			type: 'postgres',
			host: DBHOST,
			port: 5432,
			username: DBUSER,
			password: DBPASS,
			database: DBNAME,
			entities: ['src/entities_DB/*.ts', 'build/src/entities_DB/*.js'],
			synchronize: true,
		});
		console.log(`BASE DE DATOS CONECTADA A: ${DBNAME} `);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		console.log(`ERROR BASE DE DATOS: ${error.message}`);
	}
};
