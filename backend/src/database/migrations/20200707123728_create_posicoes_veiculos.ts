import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("posicoes_veiculos", (table) => {
    table.increments("id").primary();
    table.float("latitude").notNullable();
    table.float("longitude").notNullable();
    table
      .bigInteger("veiculo_id")
      .references("id")
      .inTable("veiculos")
      .onUpdate("CASCADE")
      .onDelete("SET NULL")
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("posicoes_veiculos");
}
