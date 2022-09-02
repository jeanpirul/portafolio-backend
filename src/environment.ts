require('dotenv').config('../.env');

export const PORT = process.env.PORT || '';
export const DBNAME: string = process.env.DBNAME || '';
export const DBHOST: string = process.env.DBHOST || '';
export const DBUSER: string = process.env.DBUSER || '';
export const DBPASS: string = process.env.DBPASS || '';
export const DBOPTIONS = { DBNAME, DBHOST, DBPASS, DBUSER };
