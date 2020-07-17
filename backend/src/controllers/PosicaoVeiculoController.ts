import { Request, Response } from "express";
import knex from "../database/connection";

class PosicaoVeiculoController {
  /**
   * Retorna um array com as posições cadastrados
   * @param request 
   * @param response 
   */
  async index(request: Request, response: Response) {
    const posicoesVeiculos = await knex("posicoes_veiculos").select(
      "posicoes_veiculos.*"
    );
    return response.json(posicoesVeiculos);
  }

  /**
   * Retorna a posição com id do path da requisição
   * @param request 
   * @param response 
   */
  async show(request: Request, response: Response) {
    const posicaoVeiculo = await knex("posicoes_veiculos")
      .select("posicoes_veiculos.*")
      .where("id", request.params.id)
      .first();
    if (!posicaoVeiculo) {
      return response.status(400).json({ message: "Posição não encontrada!" });
    }
    return response.json(posicaoVeiculo);
  }

  /**
   * Cadastra uma nova posição no sistema e retorna uma mensagem de sucesso
   * @param request 
   * @param response 
   */
  async create(request: Request, response: Response) {
    const { latitude, longitude, veiculo_id } = request.body;
    const dados = {
      latitude,
      longitude,
      veiculo_id,
    };
    const veiculo = await knex("veiculos").where("id", veiculo_id).first();
    if (!veiculo) {
      return response.status(400).json({ message: "Veículo não encontrado!" });
    }
    const trx = await knex.transaction();
    try {
      await trx("posicoes_veiculos").insert(dados);
      await trx.commit();
      return response.status(201).json({
        message: "Posição adicionada com sucesso!",
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
   * Atualiza a posição com o id do path da requisição e retorna uma mensagem de
   * sucesso
   * @param request 
   * @param response 
   */
  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { latitude, longitute, veiculo_id } = request.body;
    const dados = {
      latitude,
      longitute,
      veiculo_id,
    };
    const posicao = await knex("posicoes_veiculos")
      .select("posicoes_veiculos.*")
      .where("id", id)
      .first();
    if (!posicao) {
      return response.status(400).json({ message: "Posição não encontrada!" });
    }
    if (veiculo_id) {
      const veiculo = await knex("veiculos").where("id", veiculo_id).first();
      if (!veiculo) {
        return response
          .status(400)
          .json({ message: "Veículo não encontrado!" });
      }
    }
    const trx = await knex.transaction();
    try {
      await trx("posicoes_veiculos")
        .where("id", id)
        .update(dados);
      await trx.commit();
      return response.json({
        message: "Posição atualizada com sucesso!",
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
   * Remove a posição com id do path da requisição e retorna uma mensagem de
   * sucesso
   * @param request 
   * @param response 
   */
  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const posicao = await knex("posicoes_veiculos")
      .select("posicoes_veiculos.*")
      .where("id", id)
      .first();
    if (!posicao) {
      return response.status(400).json({ message: "Posição não encontrada!" });
    }
    const trx = await knex.transaction();
    try {
      await trx("posicoes_veiculos").where("id", id).delete();
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

export default PosicaoVeiculoController;
