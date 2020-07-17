import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("paradas", (table) => {
    table.bigInteger("id").primary();
    table.string("nome").notNullable();
    table.float("latitude").notNullable();
    table.float("longitude").notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("paradas");
}
