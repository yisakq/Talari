import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, Table, Button, notification } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import { sepolia } from '@wagmi/chains';
import ABI from '../../abi.json';
import { ethers } from 'ethers';
import "./RequestActivity.css";

function RequestActivity({ requests,getNameAndBalance }) {
  // Transform the requests array into an array of objects
  const dataSource = requests["0"].map((_, index) => ({
    key: index,
    requester: requests["3"][index],
    value: requests["1"][index],
    message: requests["2"][index],
    address:requests["0"][index]
  }));
  const [deleteKey, setDeleteKey] = useState(null);

  const { config: configDelete } = usePrepareContractWrite({
    chainId: sepolia.id,
    address: "0x12dfa074761eee32cec7E1381a8e1E755575B098",
    abi: ABI,
    functionName: "deleteRequest",
    args: [deleteKey], // Adjust to your contract's delete function parameters
    overrides: {
      gasLimit: 5000000,
      gasPrice: ethers.utils.parseUnits('10', 'gwei')
    }
  });

  const { write: writeDelete, data: dataDelete, isError: isErrorDelete, error: errorDelete } = useContractWrite(configDelete);

  const { isSuccess: isSuccessDelete } = useWaitForTransaction({
    hash: dataDelete?.hash,
  });

  useEffect(() => {
    if (isSuccessDelete) {
      getNameAndBalance();
      notification.success({ message: 'Request deleted successfully' });
    }
    if (isErrorDelete) {
      notification.error({
        message: 'Failed to delete request',
        description: errorDelete.message
      });
      console.error('Delete request failed:', errorDelete);
    }
  }, [isSuccessDelete, isErrorDelete]);

  const handleDelete = (key) => {
    setDeleteKey(key);
    writeDelete?.();
  };

  const columns = [
    {
      title: "Requester",
      dataIndex: "requester",
      key: "requester",
    },
    {
      title:"Address",
      dataIndex:"address",
      key:"address"
    },
    {
      title: "Amount",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.key)}
        />
      ),
    },
  ];

  return (
    <Card title="Requested Payments" className="request-activity-card">
      <div className="request-activity-table-container">
        {dataSource.length > 0 ? (
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false} // Disable pagination for scrolling purpose
          />
        ) : (
          <div className="empty-state">No requests to display.</div>
        )}
      </div>
    </Card>
  );
};

RequestActivity.propTypes = {
  requests: PropTypes.shape({
    "0": PropTypes.array.isRequired,
    "1": PropTypes.array.isRequired,
    "2": PropTypes.array.isRequired,
    "3": PropTypes.array.isRequired,
  }).isRequired,
};

export default RequestActivity;
