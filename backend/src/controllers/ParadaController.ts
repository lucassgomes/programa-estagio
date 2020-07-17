import { Request, Response } from "express";
import knex from "../database/connection";

class ParadaController {
  /**
   * Retorna um array com os pontos de paradas cadastrados
   * @param request 
   * @param response 
   */
  async index(request: Request, response: Response) {
    const paradas = await knex("paradas").select("paradas.*");
    return response.json(paradas);
  }

  /**
   * Retorna o ponto de parada com id do path da requisição
   * @param request 
   * @param response 
   */
  async show(request: Request, response: Response) {
    const parada = await knex("paradas")
      .select("paradas.*")
      .where("id", request.params.id)
      .first();
    if (!parada) {
      return response.status(400).json({ message: "Parada não encontrada!" });
    }
    return response.json(parada);
  }

  /**
   * Retorna os pontos de parada mais proximos a posição informada
   * via Query Params na requisição
   * @param request 
   * @param response 
   */
  async showStops(request: Request, response: Response) {
    const { latitude, longitude } = request.query;
    const paradas = await knex("paradas")
      .select("paradas.*")
      .whereBetween("latitude", [Number(latitude) - 1, Number(latitude) + 1])
      .whereBetween("longitude", [Number(longitude) - 1, Number(longitude) + 1]);
    return response.json(paradas);
  }

  /**
   * Retorna as linhas associadas ao ponto de parada informado no path da 
   * requisição
   * @param request 
   * @param response 
   */
  async showLines(request: Request, response: Response) {
    const { id } = request.params;
    const parada = await knex("paradas")
      .select("paradas.*")
      .where("id", id)
      .first();
    if (!parada) {
      return response.status(400).json({ message: "Parada não encontrada!" });
    }
    const linhas = await knex("linhas")
      .join("linhas_paradas", "linhas.id", "=", "linhas_paradas.linha_id")
      .where("linhas_paradas.parada_id", id)
      .select("linhas.*");
    return response.json(Object.assign(parada, { linhas }));
  }

  /**
   * Cadastra um novo ponto de parada no sistema e retorna uma mensagem de 
   * sucesso
   * @param request 
   * @param response 
   */
  async create(request: Request, response: Response) {
    const { id, nome, latitude, longitude } = request.body;
    const dados = {
      id,
      nome,
      latitude,
      longitude,
    };
    const parada = await knex("paradas")
      .select("paradas.*")
      .where("id", id)
      .first();
    if (parada) {
      return response
        .status(400)
        .json({ message: "Parada com mesmo id já foi cadastrada no sistema!" });
    }
    const trx = await knex.transaction();
    try {
      await trx("paradas").insert(dados);
      await trx.commit();
      return response.status(201).json({
        message: "Parada adicionada com sucesso!",
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
   * Atualiza o ponto de parada com o id do path da requisição e retorna uma
   * mensagem de sucesso
   * @param request 
   * @param response 
   */
  async update(request: Request, response: Response) {
    const idAtual = request.params.id;
    const { id, nome, latitude, longitude } = request.body;
    const dados = {
      id,
      nome,
      latitude,
      longitude,
    };
    const parada = await knex("paradas")
      .select("paradas.*")
      .where("id", idAtual)
      .first();
    if (!parada)
      return response.status(400).json({ message: "Parada não encontrada!" });
    if (id) {
      const paradaExistente = await knex("paradas")
        .select("paradas.id")
        .where("id", id)
        .where("id", "<>", idAtual)
        .first();
      if (paradaExistente) {
        return response.status(400).json({
          message: "Parada com mesmo id já foi cadastrada no sistema!",
        });
      }
    }
    const trx = await knex.transaction();
    try {
      await trx("paradas").where("id", idAtual).update(dados);
      await trx.commit();
      return response.json({
        message: "Parada atualizada com sucesso!",
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
   * Remove o ponto de parada com id do path da requisição e retorna uma mensagem
   * de sucesso
   * @param request 
   * @param response 
   */
  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const parada = await knex("paradas")
      .select("paradas.*")
      .where("id", id)
      .first();
    if (!parada)
      return response.status(400).json({ message: "Parada não encontrada!" });
    const trx = await knex.transaction();
    try {
      await trx("paradas").where("id", id).delete();
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

export default ParadaController;
