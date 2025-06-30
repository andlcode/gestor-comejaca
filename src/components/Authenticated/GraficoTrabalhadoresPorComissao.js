import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const GraficoTrabalhadoresPorComissao = ({ dados }) => {
  const [expandido, setExpandido] = useState(false);

  return (
    <div>
      <button
        onClick={() => setExpandido(!expandido)}
        style={{
          marginBottom: "1rem",
          padding: "0.5rem 1rem",
          cursor: "pointer",
          backgroundColor: "#0d1b2a",
          color: "white",
          border: "none",
          borderRadius: "5px",
          fontWeight: "600",
        }}
      >
        {expandido ? "Contrair Gráfico" : "Expandir Gráfico"}
      </button>

      <ResponsiveContainer width="100%" height={expandido ? 600 : 400}>
        <BarChart
          data={dados}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }} // bottom maior p/ labels rotacionados
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="comissao"
            angle={-45}
            textAnchor="end"
            interval={0}
            tickFormatter={(value) =>
              value.length > 15 ? value.slice(0, 15) + "..." : value
            }
            height={60} // para garantir espaço para labels inclinados
            style={{ fontSize: 12, fill: "#222" }}
          />
          <YAxis allowDecimals={false} style={{ fontSize: 12, fill: "#222" }} />
          <Tooltip
            wrapperStyle={{ fontSize: 14 }}
            formatter={(value) => [value, "Trabalhadores"]}
          />
          <Bar dataKey="quantidade" fill="#0d1b2a" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoTrabalhadoresPorComissao;
