require('dotenv/config');

module.exports = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS, // Nao e mais necessario mudar a senha do BD!!!
  host: process.env.DB_HOST,
  dialect: 'postgres',
  define: {
    timestamps: true, // created_at and updated_at in each column of database
    underscored: true,
    underscoredAll: true,
    /* create a table from model with underscore.
    ex.: model UserGroup,the table will be created as user_groups and NOT UserGroups*/
  },
};
