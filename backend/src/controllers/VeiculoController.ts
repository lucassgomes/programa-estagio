import { Request, Response } from "express";
import knex from "../database/connection";

class VeiculoController {
  /**
   * Retorna um array com os veículos cadastrados
   * @param request 
   * @param response 
   */
  async index(request: Request, response: Response) {
    const veiculos = await knex("veiculos").select("veiculos.*");
    return response.json(veiculos);
  }

  /**
   * Retorna o veículo com id do path da requisição
   * @param request 
   * @param response 
   */
  async show(request: Request, response: Response) {
    const veiculo = await knex("veiculos")
      .select("veiculos.*")
      .where("id", request.params.id)
      .first();
    if (!veiculo) {
      return response.status(400).json({ message: "Veículo não encontrado!" });
    }
    return response.json(veiculo);
  }

  /**
   * Cadastra um novo veículo no sistema e retorna uma mensagem de sucesso
   * @param request 
   * @param response 
   */
  async create(request: Request, response: Response) {
    const { id, nome, modelo, linha_id } = request.body;
    const dados = {
      id,
      nome,
      modelo,
      linha_id,
    };
    const linha = await knex("linhas").where("id", linha_id).first();
    if (!linha) {
      return response.status(400).json({ message: "Linha não encontrada!" });
    }
    const veiculo = await knex("veiculos")
      .select("veiculos.*")
      .where("id", id)
      .first();
    if (veiculo) {
      return response
        .status(400)
        .json({
          message: "Veículo com mesmo id já foi cadastrado no sistema!",
        });
    }
    const trx = await knex.transaction();
    try {
      await trx("veiculos").insert(dados);
      await trx.commit();
      return response.status(201).json({
        message: "Veículo adicionado com sucesso!",
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
   * Atualiza o veículo com o id do path da requisição e retorna uma mensagem de
   * sucesso
   * @param request 
   * @param response 
   */
  async update(request: Request, response: Response) {
    const idAtual = request.params.id;
    const { id, nome, modelo, linha_id } = request.body;
    const dados = {
      id,
      nome,
      modelo,
      linha_id,
    };
    const veiculo = await knex("veiculos")
      .select("veiculos.*")
      .where("id", idAtual)
      .first();
    if (!veiculo) {
      return response.status(400).json({ message: "Veículo não encontrado!" });
    }
    if (linha_id) {
      const linha = await knex("linhas").where("id", linha_id).first();
      if (!linha) {
        return response.status(400).json({ message: "Linha não encontrada!" });
      }
    }
    if (id) {
      const veiculoExistente = await knex("veiculos")
        .select("veiculos.id")
        .where("id", id)
        .where("id", "<>", idAtual)
        .first();
      if (veiculoExistente) {
        return response.status(400).json({
          message: "Veículo com mesmo id já foi cadastrado no sistema!",
        });
      }
    }
    const trx = await knex.transaction();
    try {
      await trx("veiculos").where("id", idAtual).update(dados);
      await trx.commit();
      return response.json({
        message: "Veículo atualizado com sucesso!",
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
   * Remove o veículo com id do path da requisição e retorna uma mensagem de
   * sucesso
   * @param request 
   * @param response 
   */
  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const veiculo = await knex("veiculos")
      .select("veiculos.*")
      .where("id", id)
      .first();
    if (!veiculo) {
      return response.status(400).json({ message: "Veículo não encontrado!" });
    }
    const trx = await knex.transaction();
    try {
      await trx("veiculos").where("id", id).delete();
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

export default VeiculoController;
