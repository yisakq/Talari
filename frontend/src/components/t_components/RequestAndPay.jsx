import React, { useState, useEffect } from "react";
import { Modal, Input, InputNumber, notification } from "antd";
import { BsSendFill } from "react-icons/bs";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import { sepolia } from '@wagmi/chains';
import ABI from '../../abi.json';
import { ethers } from 'ethers';

function RequestAndPay({ requests, getNameAndBalance }) {
  const [sendModal, setSendModal] = useState(false);
  const [requestModal, setRequestModal] = useState(false);

  const [sendAmount, setSendAmount] = useState("");
  const [sendRecipient, setSendRecipient] = useState("");
  const [sendMessage, setSendMessage] = useState("");
  const [requestAmount, setRequestAmount] = useState(5);
  const [requestAddress, setRequestAddress] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  const { config } = usePrepareContractWrite({
    chainId: sepolia.id,
    address: "0x2821C5c18549BDAD5076fC829CACB414380978dE",
    abi: ABI,
    functionName: "sendPayment",
    args: [sendRecipient, sendAmount, sendMessage],
    overrides: sendAmount > 0 ? {
      value: ethers.utils.parseEther(sendAmount.toString()), // Send value in ether
      gasLimit: 5000000,
      gasPrice: ethers.utils.parseUnits('10', 'gwei') // Setting gas price to 10 Gwei
    } : {}
  });

  const { write, data, isError: isErrorSend, error: errorSend } = useContractWrite(config);

  const { config: configRequest } = usePrepareContractWrite({
    chainId: sepolia.id,
    address: "0x2821C5c18549BDAD5076fC829CACB414380978dE",
    abi: ABI,
    functionName: "createRequest",
    args: [requestAddress, requestAmount, requestMessage],
    overrides: {
      gasLimit: 5000000,
      gasPrice: ethers.utils.parseUnits('10', 'gwei') // Setting gas price to 10 Gwei
    }
  });

  const { write: writeRequest, data: dataRequest, isError: isErrorRequest, error: errorRequest } = useContractWrite(configRequest);

  const { isSuccess: isSuccessSend } = useWaitForTransaction({
    hash: data?.hash,
  });

  const { isSuccess: isSuccessRequest } = useWaitForTransaction({
    hash: dataRequest?.hash,
  });

  useEffect(() => {
    if (isSuccessSend || isSuccessRequest) {
      getNameAndBalance();
      notification.success({ message: "Transaction successful" });
    }
    if (isErrorSend || isErrorRequest) {
      notification.error({
        message: "Transaction failed",
        description: isErrorSend ? errorSend.message : errorRequest.message
      });
      console.error("Transaction failed:", isErrorSend ? errorSend : errorRequest);
    }
  }, [isSuccessSend, isSuccessRequest, isErrorSend, isErrorRequest]);

  const showSendModal = () => setSendModal(true);
  const hideSendModal = () => setSendModal(false);
  const showRequestModal = () => setRequestModal(true);
  const hideRequestModal = () => setRequestModal(false);

  return (
    <>
      {/* Send Modal */}
      <Modal
        title="Send Payment"
        open={sendModal}
        onOk={() => {
          write?.();
          hideSendModal();
        }}
        onCancel={hideSendModal}
      >
        <InputNumber
          value={sendAmount}
          onChange={value => setSendAmount(value)}
          placeholder="Amount"
        />
        <Input
          value={sendRecipient}
          onChange={(e) => setSendRecipient(e.target.value)}
          placeholder="Recipient Address"
        />
        <Input
          value={sendMessage}
          onChange={(e) => setSendMessage(e.target.value)}
          placeholder="Message"
        />
      </Modal>

      {/* Request Modal */}
      <Modal
        title="Request Payment"
        open={requestModal}
        onOk={() => {
          writeRequest?.();
          hideRequestModal();
        }}
        onCancel={hideRequestModal}
      >
        <InputNumber
          value={requestAmount}
          onChange={value => setRequestAmount(value)}
          placeholder="Amount"
        />
        <Input
          value={requestAddress}
          onChange={(e) => setRequestAddress(e.target.value)}
          placeholder="Recipient Address"
        />
        <Input
          value={requestMessage}
          onChange={(e) => setRequestMessage(e.target.value)}
          placeholder="Message"
        />
      </Modal>

      {/* Quick Options */}
      <div className="requestAndPay">
        <div className="quickOption" onClick={showSendModal}>
          <BsSendFill style={{ fontSize: "26px" }} />
          Send
        </div>
        <div className="quickOption" onClick={showRequestModal}>
          Request
        </div>
      </div>
    </>
  );
}

export default RequestAndPay;
