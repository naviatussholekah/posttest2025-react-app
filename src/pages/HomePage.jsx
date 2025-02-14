import React, { useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { Chart } from "primereact/chart";

export default function HomePage() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("formData");
    if (storedData) {
      setData(JSON.parse(storedData));
      setFilteredData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) {
      setFilteredData(data);
      return;
    }
  
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
  
    const result = data.filter((item) => {
      const [day, month, year] = item.tanggalPembelian.split('/');
      const purchaseDate = new Date(`${year}-${month}-${day}`);
      return purchaseDate >= start && purchaseDate <= end;
    });
  
    setFilteredData(result);
  }, [startDate, endDate, data]);
  
  

  const aggregateData = () => {
    return filteredData.reduce((acc, item) => {
      const { user, pajak } = item;
      if (!acc[user]) {
        acc[user] = { user, pajak: 0 };
      }
      acc[user].pajak += pajak;
      return acc;
    }, {});
  };

  const chartData = Object.values(aggregateData());

  const formatDateLabel = (date) => {
    if (!date) return null;

    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const startLabel = formatDateLabel(startDate);
  const endLabel = formatDateLabel(endDate);

  const labelText =
    startLabel && endLabel
      ? `Total PPN pada tanggal ${startLabel} sampai ${endLabel}`
      : "Total PPN";

  const barData = {
    labels: chartData.map((item) => item.user),
    datasets: [
      {
        label: labelText,
        data: chartData.map((item) => item.pajak),
        backgroundColor: "#66BB6A",
      },
    ],
  };

  const pieData = {
    labels: chartData.map((item) => item.user),
    datasets: [
      {
        data: chartData.map((item) => item.pajak),
        backgroundColor: ["#FF9800", "#42A5F5", "#66BB6A", "#FF7043"],
        label: labelText,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const total = tooltipItem.raw;
            const percentage = (
              (total / chartData.reduce((sum, item) => sum + item.pajak, 0)) *
              100
            ).toFixed(2);
            return `${tooltipItem.label}: ${total} (${percentage}%)`;
          },
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div>
      <p
        style={{
          textAlign: "left",
          marginTop: "30px",
          marginLeft: "10px",
          marginBottom: "20px",
        }}
      >
        Welcome,
      </p>
      <div className="p-d-flex p-mb-3">
        <div className="p-field p-grid">
          <label className="p-col-fixed" style={{ width: "140px" }}>
            Start Date:
          </label>
          <div className="p-col">
            <Calendar
              value={startDate}
              onChange={(e) => setStartDate(e.value)}
              dateFormat="yy-mm-dd"
              placeholder="Select Start Date"
            />
          </div>
        </div>

        <div className="p-field p-grid ml-4">
          <label className="p-col-fixed" style={{ width: "140px" }}>
            End Date:
          </label>
          <div className="p-col">
            <Calendar
              value={endDate}
              onChange={(e) => setEndDate(e.value)}
              dateFormat="yy-mm-dd"
              placeholder="Select End Date"
            />
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          gap: "20px",
        }}
      >
        <div style={{ flex: "1", height: "400px" }}>
          <Chart type="pie" data={pieData} options={pieOptions} />
        </div>

        <div style={{ flex: "1", height: "400px" }}>
          <Chart type="bar" data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}
