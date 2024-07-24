// AccountDetails.js

import React, { useState } from 'react';
import { Card, Input, Button, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import matic from '../../assets/matic.png';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import { sepolia } from '@wagmi/chains';
import ABI from '../../abi.json';
import {useEffect} from 'react'
const contractAddress = '0x12dfa074761eee32cec7E1381a8e1E755575B098'; 

function AccountDetails({ address, name, balance,getNameAndBalance }) {
  const [username, setUsername] = useState('');
  const [visible, setVisible] = useState(false);

  const { config } = usePrepareContractWrite({
    chainId: sepolia.id,
    address: contractAddress,
    abi: ABI,
    functionName: 'addName',
    args: [username],
  });

  const { write,data } = useContractWrite(config);
  const { isSuccess } = useWaitForTransaction({ hash: data?.hash });
  useEffect(() => {
    if (isSuccess) {
     getNameAndBalance();
    }
  }, [isSuccess]);
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmitUsername = async () => {
    try {
      await write();
      setUsername('');
      setVisible(false);
      // Optionally, you can update the username displayed in your component state or re-fetch it.
    } catch (error) {
      console.error('Error adding name:', error);
    }
  };

  const showUsernamePopup = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Card title="Account Details" style={{ width: '100%' }}>
      <div className="accountDetailRow">
        <UserOutlined style={{ color: '#767676', fontSize: '25px' }} />
        <div>
          <div className="accountDetailHead"> {name} </div>
          <div className="accountDetailBody">
            Address: {address ? `${address.slice(0, 4)}...${address.slice(38)}` : 'N/A'}
          </div>
        </div>
      </div>
      <div className="accountDetailRow">
        <img src={matic} alt="maticLogo" width={25} />
        <div>
          <div className="accountDetailHead"> Native SepoliaETH</div>
          <div className="accountDetailBody">{balance}</div>
        </div>
      </div>
      <div className="balanceOptions">
        <div className="">
          <Button type="primary" onClick={showUsernamePopup}>
            Set Username
          </Button>
          <Modal
            title="Set Username"
            visible={visible}
            onOk={handleSubmitUsername}
            onCancel={handleCancel}
            okText="Set Username"
            cancelText="Cancel"
          >
            <Input
              placeholder="Enter new username"
              value={username}
              onChange={handleUsernameChange}
            />
          </Modal>
        </div>
      </div>
    </Card>
  );
}

export default AccountDetails;
