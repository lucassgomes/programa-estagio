import { Request, Response } from "express";
import knex from "../database/connection";

class LinhaController {
  /**
   * Retorna um array com as linhas cadastradas
   * @param request 
   * @param response 
   */
  async index(request: Request, response: Response) {
    const linhas = await knex("linhas").select("linhas.*");
    for (const linha of linhas) {
      const paradas = await knex("paradas")
        .join("linhas_paradas", "paradas.id", "=", "linhas_paradas.parada_id")
        .where("linhas_paradas.linha_id", linha.id)
        .select("paradas.*");
      Object.assign(linha, { paradas });
    }
    return response.json(linhas);
  }

  /**
   * Retorna a linha com id do path da requisição
   * @param request 
   * @param response 
   */
  async show(request: Request, response: Response) {
    const { id } = request.params;
    const linha = await knex("linhas")
      .select("linhas.*")
      .where("id", id)
      .first();
    if (!linha) {
      return response.status(400).json({ message: "Linha não encontrada!" });
    }

    const paradas = await knex("paradas")
      .join("linhas_paradas", "paradas.id", "=", "linhas_paradas.parada_id")
      .where("linhas_paradas.linha_id", id)
      .select("paradas.*");
    return response.json(Object.assign(linha, { paradas }));
  }

  /**
   * Retorna a linha com os veículos associados a ela
   * @param request 
   * @param response 
   */
  async showVehicles(request: Request, response: Response) {
    const { id } = request.params;
    const linha = await knex("linhas")
      .select("linhas.*")
      .where("id", id)
      .first();
    if (!linha) {
      return response.status(400).json({ message: "Linha não encontrada!" });
    }
    const veiculos = await knex("veiculos")
      .where("linha_id", id)
      .select("veiculos.*");
    return response.json(Object.assign(linha, { veiculos }));
  }

  /**
   * Cadastra uma nova linha no sistema e retorna uma mensagem de sucesso
   * @param request 
   * @param response 
   */
  async create(request: Request, response: Response) {
    const { id, nome, paradas } = request.body;
    const data = {
      id,
      nome,
    };
    const linha = await knex("linhas")
      .select("linhas.*")
      .where("id", id)
      .first();
    if (linha) {
      return response
        .status(400)
        .json({ message: "Linha com mesmo id já foi cadastrada no sistema!" });
    }
    let listaParadas: Array<Object> = [];
    for (const parada_id of paradas) {
      const parada = await knex("paradas")
        .select("paradas.id")
        .where("id", parada_id)
        .first();
      if (!parada) {
        return response.status(400).json({
          message: `Parada com id ${parada_id} não foi encontrada no sistema!`,
        });
      }
      listaParadas.push({
        linha_id: id,
        parada_id,
      });
    }
    const trx = await knex.transaction();
    try {
      await knex("linhas").insert(data);
      await trx("linhas_paradas").insert(listaParadas);
      await trx.commit();
      return response.status(201).json({
        message: "Linha adicionada com sucesso!",
      });
    } catch (error) {
      await trx.rollback();
      return response.status(500).json({
        message: "Oops! Não foi possível executar essa ação",
        error,
      });
    }
  }

  /**
   * Atualiza a linha com o id do path da requisição e retorna uma mensagem de 
   * sucesso
   * @param request 
   * @param response 
   */
  async update(request: Request, response: Response) {
    const idAtual = request.params.id;
    const { id, nome, paradas } = request.body;
    const dados = {
      id,
      nome,
    };
    const linha = await knex("linhas")
      .select("linhas.*")
      .where("id", idAtual)
      .first();
    if (!linha) {
      return response.status(400).json({ message: "Linha não encontrada!" });
    }
    let listaParadas: Array<Object> = [];
    if (paradas) {
      for (const parada_id of paradas) {
        const parada = await knex("paradas")
          .select("paradas.id")
          .where("id", parada_id)
          .first();
        if (!parada) {
          return response.status(400).json({
            message: `Parada com id ${parada_id} não foi encontrada no sistema!`,
          });
        }
        listaParadas.push({
          linha_id: id || idAtual,
          parada_id,
        });
      }
    }
    if (id) {
      const linhaExistente = await knex("linhas")
        .select("linhas.id")
        .where("id", id)
        .where("id", "<>", idAtual)
        .first();
      if (linhaExistente) {
        return response.status(400).json({
          message: "Linha com mesmo id já foi cadastrada no sistema!",
        });
      }
    }
    const trx = await knex.transaction();
    try {
      if (dados.id || dados.nome)
        await trx("linhas").where("id", idAtual).update(dados);
      if (paradas) {
        await trx("linhas_paradas").where("linha_id", id || idAtual).delete();
        await trx("linhas_paradas").insert(listaParadas);
      }
      await trx.commit();
      return response.json({
        message: "Linha atualizada com sucesso!",
      });
    } catch (error) {
      await trx.rollback();
      return response.status(500).json({
        message: "Oops! Não foi possível executar essa ação",
        error,
      });
    }
  }

  /**
   * Remove a linha com id do path da requisição e retorna uma mensagem de
   * sucesso
   * @param request 
   * @param response 
   */
  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const linha = await knex("linhas")
      .select("linhas.*")
      .where("id", id)
      .first();
    if (!linha) {
      return response.status(400).json({ message: "Linha não encontrada!" });
    }
    const trx = await knex.transaction();
    try {
      await trx("linhas").where("id", id).delete();
      await trx.commit();
      return response.status(204).send();
    } catch (error) {
      await trx.rollback();
      return response.status(500).json({
        message: "Oops! Não foi possível executar essa ação",
        error,
      });
    }
  }
}

export default LinhaController;
