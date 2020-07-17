import express from "express";
import { celebrate, Joi } from "celebrate";

import ParadaController from "./controllers/ParadaController";
import LinhaController from "./controllers/LinhaController";
import VeiculoController from "./controllers/VeiculoController";
import PosicaoVeiculoController from "./controllers/PosicaoVeiculoController";

const routes = express.Router();

const paradaController = new ParadaController();
const linhaController = new LinhaController();
const veiculoController = new VeiculoController();
const posicaoVeiculoController = new PosicaoVeiculoController();

routes.get("/paradas", paradaController.index);
routes.get(
  "/paradas-posicao",
  celebrate({
    query: Joi.object().keys(
      {
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
      },
      {
        abortEarly: false,
      }
    ),
  }),
  paradaController.showStops
);
routes.get("/paradas/:id", paradaController.show);
routes.get("/paradas/:id/linhas", paradaController.showLines);
routes.post(
  "/paradas",
  celebrate({
    body: Joi.object().keys(
      {
        id: Joi.number().required(),
        nome: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
      },
      {
        abortEarly: false,
      }
    ),
  }),
  paradaController.create
);
routes.put(
  "/paradas/:id",
  celebrate({
    body: Joi.object()
      .keys({
        id: Joi.number(),
        nome: Joi.string(),
        latitude: Joi.number(),
        longitude: Joi.number(),
      })
      .required(),
  }),
  paradaController.update
);
routes.delete("/paradas/:id", paradaController.delete);

routes.get("/linhas", linhaController.index);
routes.get("/linhas/:id", linhaController.show);
routes.get("/linhas/:id/veiculos", linhaController.showVehicles);
routes.post(
  "/linhas",
  celebrate({
    body: Joi.object().keys(
      {
        id: Joi.number().required(),
        nome: Joi.string().required(),
        paradas: Joi.array(),
      },
      {
        abortEarly: false,
      }
    ),
  }),
  linhaController.create
);
routes.put(
  "/linhas/:id",
  celebrate({
    body: Joi.object().keys(
      {
        id: Joi.number(),
        nome: Joi.string(),
        paradas: Joi.array(),
      },
      {
        abortEarly: false,
      }
    ),
  }),
  linhaController.update
);
routes.delete("/linhas/:id", linhaController.delete);

routes.get("/veiculos", veiculoController.index);
routes.get("/veiculos/:id", veiculoController.show);
routes.post(
  "/veiculos",
  celebrate({
    body: Joi.object().keys(
      {
        id: Joi.number().required(),
        nome: Joi.string().required(),
        modelo: Joi.string().required(),
        linha_id: Joi.number(),
      },
      {
        abortEarly: false,
      }
    ),
  }),
  veiculoController.create
);
routes.put(
  "/veiculos/:id",
  celebrate({
    body: Joi.object().keys(
      {
        id: Joi.number(),
        nome: Joi.string(),
        modelo: Joi.string(),
        linha_id: Joi.number(),
      },
      {
        abortEarly: false,
      }
    ),
  }),
  veiculoController.update
);
routes.delete("/veiculos/:id", veiculoController.delete);

routes.get("/posicoes", posicaoVeiculoController.index);
routes.get("/posicoes/:id", posicaoVeiculoController.show);
routes.post(
  "/posicoes",
  celebrate({
    body: Joi.object().keys(
      {
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        veiculo_id: Joi.number().required(),
      },
      {
        abortEarly: false,
      }
    ),
  }),
  posicaoVeiculoController.create
);
routes.put(
  "/posicoes/:id",
  celebrate({
    body: Joi.object().keys(
      {
        latitude: Joi.number(),
        longitude: Joi.number(),
        veiculo_id: Joi.number(),
      },
      {
        abortEarly: false,
      }
    ),
  }),
  posicaoVeiculoController.update
);
routes.delete("/posicoes/:id", posicaoVeiculoController.delete);

export default routes;
