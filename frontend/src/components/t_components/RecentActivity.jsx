import React from "react";
import { Card, Table } from "antd";
import "./RecentActivity.css";

const columns = [
  {
    title: "Payment Subject",
    dataIndex: "subject",
    key: "subject",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Message",
    dataIndex: "message",
    key: "message",
  },
  {
    title: "Amount",
    key: "amount",
    render: (_, record) => (
      <div
        style={
          record.type.toLowerCase() === "sent" ? { color: "red" } : { color: "green" }
        }
      >
        {record.type.toLowerCase() === "sent" ? "-" : "+"}
        {record.amount} ETH
      </div>
    ),
  },
];

function RecentActivity({ history }) {
  return (
    <Card title="Recent Activity" className="recent-activity-card">
      <div className="recent-activity-table-container">
        <Table
          dataSource={history}
          columns={columns}
          pagination={false} // Disable pagination for scrolling purpose
        />
      </div>
    </Card>
  );
}

export default RecentActivity;
