import React, { useState } from "react";
import { Table } from "antd";
import axios from "axios";
import styles from "./App.module.css";

const App = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [errorInParsing, setErrorInParsing] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchData();
  };

  const fetchData = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/ask", {
        question,
      });

      setResponse(response.data);
      setTableData(response.data);

      const firstItem = response.data[0];
      if (firstItem) {
        const dynamicColumns = Object.keys(firstItem).map((key) => ({
          title: key.toUpperCase(),
          dataIndex: key,
          key: key,
        }));
        setColumns(dynamicColumns);
      }
    } catch (error) {
      console.error("Error asking question:", error.message);
      setErrorInParsing(true);
      setResponse(response);
    }
  };

  return (
    <>
      <h1 className={styles.heading}>KEEPING THE LIGHTS ON!</h1>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Input your statement
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={styles.input}
            />
          </label>
          <button type="submit" className={styles.button}>
            Submit
          </button>
        </form>
      </div>
      {response && !errorInParsing && (
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={false}
          rowKey={() => Math.random()}
        />
      )}
      {response && errorInParsing && response}
    </>
  );
};

export default App;
