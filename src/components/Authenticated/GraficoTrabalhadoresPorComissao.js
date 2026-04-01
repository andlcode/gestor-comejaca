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
import styled from "styled-components";

const GraficoTrabalhadoresPorComissao = ({ dados }) => {
  const [expandido, setExpandido] = useState(false);

  return (
    <ChartShell>
      <ChartActionButton
        onClick={() => setExpandido(!expandido)}
      >
        {expandido ? "Contrair Gráfico" : "Expandir Gráfico"}
      </ChartActionButton>

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
    </ChartShell>
  );
};

export default GraficoTrabalhadoresPorComissao;

const ChartShell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const ChartActionButton = styled.button`
  align-self: flex-start;
  min-height: 38px;
  padding: 0 14px;
  cursor: pointer;
  background: #1f2133;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 10px 18px -18px rgba(17, 24, 39, 0.35);
  transition:
    background 0.18s ease,
    transform 0.18s ease;

  &:hover {
    background: #2b2d42;
    transform: translateY(-1px);
  }
`;
