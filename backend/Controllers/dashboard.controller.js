// backend/controllers/dashboard.controller.js
import Componente from "../models/componente.js";
import User from "../models/user.model.js";

/**
 * 1) Composición promedio del RAEE por kg de residuo
 *    (fracciones que suman ≈ 1)
 */
const COMPOSICION_RAEE = {
  acero: 0.25,         // kg de acero por kg de RAEE
  aluminio: 0.08,      // kg de aluminio
  plastico: 0.32,      // kg de plásticos totales (carcasas + cables)
  vidrio: 0.15,        // kg de vidrio/cerámica
  pcb: 0.05,           // kg de placas electrónicas
  otrosMetales: 0.02,  // kg de otros metales no ferrosos (Zn, latón, etc.)
  cobre: 0.08          // kg de cobre total (estructural + cables)
};

/**
 * 2) Factores de ahorro neto de CO₂ (kg CO₂ evitado por kg reciclado)
 *    Estos son valores ejemplo. Si luego consigues datos oficiales,
 *    solo actualizas este objeto y todo el cálculo se ajusta.
 */
const FACTOR_EMISION = {
  acero: 1.5,        // kg CO2/kg
  aluminio: 10.0,
  plastico: 1.5,
  vidrio: 0.3,
  pcb: 5.0,
  otrosMetales: 2.0,
  cobre: 3.0
};

/**
 * 3) Factor global: kg CO₂ evitado por kg de RAEE reciclado,
 *    calculado a partir de la composición y los factores.
 *
 *    Fórmula:
 *    Σ (fracción_material_i * factor_emisión_i)
 */
const KG_CO2_POR_KG_RESIDUO =
  COMPOSICION_RAEE.acero * FACTOR_EMISION.acero +
  COMPOSICION_RAEE.aluminio * FACTOR_EMISION.aluminio +
  COMPOSICION_RAEE.plastico * FACTOR_EMISION.plastico +
  COMPOSICION_RAEE.vidrio * FACTOR_EMISION.vidrio +
  COMPOSICION_RAEE.pcb * FACTOR_EMISION.pcb +
  COMPOSICION_RAEE.otrosMetales * FACTOR_EMISION.otrosMetales +
  COMPOSICION_RAEE.cobre * FACTOR_EMISION.cobre;

// Opcional: si quieres ver el valor en consola cuando arranca el backend
console.log(
  "[RAEE] Factor kg CO2 evitado / kg residuo =",
  KG_CO2_POR_KG_RESIDUO.toFixed(3)
);
// Con los valores de arriba debería dar ~2.230

export const getDashboardStats = async (req, res) => {
  try {
    // 1) Total kg recuperados (suma de todos los pesoKg > 0)
    const agg = await Componente.aggregate([
      {
        $match: {
          pesoKg: { $gt: 0 } // ignoramos null/0/undefined
        }
      },
      {
        $group: {
          _id: null,
          totalKg: { $sum: "$pesoKg" }
        }
      }
    ]);

    const kgRecuperados = agg[0]?.totalKg || 0;

    // 2) Equipos reacondicionados / reutilizables
    const equiposReacondicionados = await Componente.countDocuments({
      estado: { $in: ["reacondicionable", "reutilizable"] }
    });

    // 3) CO₂ evitado usando el factor calculado
    const co2EvitadoKg = kgRecuperados * KG_CO2_POR_KG_RESIDUO;

    // 4) Total usuarios
    const totalUsuarios = await User.countDocuments({});

    return res.json({
      kgRecuperados,
      equiposReacondicionados,
      co2EvitadoKg,
      factorCo2PorKgResiduo: KG_CO2_POR_KG_RESIDUO, // por si lo quieres mostrar en el frontend
      totalUsuarios
    });
  } catch (err) {
    console.error("getDashboardStats error:", err);
    return res
      .status(500)
      .json({ error: "No se pudieron obtener las estadísticas" });
  }
};
