import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("veiculos", (table) => {
    table.bigInteger("id").primary();
    table.string("nome").notNullable();
    table.string("modelo").notNullable();
    table
      .bigInteger("linha_id")
      .references("id")
      .inTable("linhas")
      .onUpdate("CASCADE")
      .onDelete("SET NULL")
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("veiculos");
}
