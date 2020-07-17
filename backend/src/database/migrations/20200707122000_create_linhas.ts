import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("linhas", (table) => {
    table.bigInteger("id").primary();
    table.string("nome").notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("linhas");
}
