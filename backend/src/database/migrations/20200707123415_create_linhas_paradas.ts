import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("linhas_paradas", (table) => {
    table.increments("id").primary();
    table
      .bigInteger("linha_id")
      .notNullable()
      .references("id")
      .inTable("linhas")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .bigInteger("parada_id")
      .notNullable()
      .references("id")
      .inTable("paradas")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("linhas_paradas");
}
