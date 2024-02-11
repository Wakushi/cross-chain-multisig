// components/MyLineChart.tsx
"use client"
import { chartBgColor, chartBorderColor } from "@/services/data/chart-colors"
import { Token } from "@/types/Token"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js"
import { Doughnut } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  ArcElement
)

export interface TokenChartData {
  labels: string[]
  datasets: {
    label: string
    data: string[]
    backgroundColor: string[]
    borderColor: string[]
    borderWidth: number
  }[]
}

interface DoughnutChartProps {
  tokens: Token[]
}

export default function TokenDoughnutChart({ tokens }: DoughnutChartProps) {
  function computeTokenData(): TokenChartData {
    const data: TokenChartData = {
      labels: [],
      datasets: [
        {
          label: "USD value",
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,
        },
      ],
    }

    if (tokens) {
      tokens.forEach((token, index) => {
        data.labels.push(token.symbol)
        data.datasets[0].data.push(token.value?.toString() ?? "0")
        data.datasets[0].backgroundColor.push(chartBgColor[index])
        data.datasets[0].borderColor.push(chartBorderColor[index])
      })
    }

    return data
  }

  const data = computeTokenData()

  return (
    <div className="p-4 px-20 flex gap-20">
      <div className="h-[200px]">
        <Doughnut data={data} />
      </div>
      <div className="w-[300px]">
        <p className="text-2xl font-bold mb-2">Balance by token</p>
        <div className="flex flex-col">
          {data.labels.map((label: string, index: number) => {
            const totalTokenAmount: number = data.datasets[0].data.reduce(
              (a: number, b: string) => Number(a) + Number(b),
              0
            )
            const tokenAmount = +data.datasets[0].data[index]
            const tokenPercentage = (tokenAmount / totalTokenAmount) * 100
            return (
              <div
                key={index}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: data.datasets[0].borderColor[index],
                    }}
                  ></div>
                  <p className="text-lg">{label}</p>
                </div>
                <p className="text-lg">{tokenPercentage.toFixed(2)}%</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
