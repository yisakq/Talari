import React from "react";
import { Card } from "antd";

function CurrentBalance({dollars}) {
  return (
    <Card title="Current Balance" style={{ width: "100%",marginTop:"50px" }}>
      <div className="currentBalance">
        <div style={{ lineHeight: "70px" }}>${dollars}</div>
        <div style={{ fontSize: "20px" }}>Available</div>
      </div>
      <div className="balanceOptions">
       
      </div>
    </Card>
  );
}

export default CurrentBalance;
