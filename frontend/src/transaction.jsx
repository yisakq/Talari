import { Layout,Button } from "antd";
import CurrentBalance from "./components/t_components/CurrentBalance"
import RequestAndPay from "./components/t_components/RequestAndPay"
import AccountDetails from "./components/t_components/AccountDetails"
import RecentActivity from "./components/t_components/RecentActivity"
import RequestActivity from './components/t_components/requests'
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import "./transaction.css";
import axios from 'axios';
import {useState,useEffect} from 'react'
const { Header, Content } = Layout;

function App() {
  const [name, setName] = useState("...");
  const [balance, setBalance] = useState("...");
  const [dollars, setDollars] = useState("...");
  const [history, setHistory] = useState(null);
  const [requests, setRequests] = useState({ "1": [0], "0": [] });

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect({ connector: new MetaMaskConnector() });


  
  function getNameAndBalance() {
    axios.get('https://talari-server.vercel.app/getNameAndBalance', {
      params: { userAddress: address },
    })
    .then((res) => {
      const response = res.data;
  
      if (response.name) {
        setName(response.name);
      }
      setBalance(String(response.balance));
      setDollars(String(response.dollars));
      setHistory(response.history); // Assuming response.history is an array
      setRequests(response.requests); // Assuming response.requests is an object
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }
  
  useEffect(() => {
    if (!isConnected) return;
    getNameAndBalance();
  }, [isConnected, address]);

  return (
    <div className="App">
      <Layout>
        <Content className="content">
          <div className="firstColumn">
            <CurrentBalance dollars={dollars}/>
            <RequestAndPay requests={requests} getNameAndBalance={getNameAndBalance} />
            <AccountDetails address={address} name={name} balance={balance}getNameAndBalance={getNameAndBalance} />
          </div>
          <div className="secondColumn">
            <RecentActivity history={history}/>
            <RequestActivity requests={requests}getNameAndBalance={getNameAndBalance}/>
          </div>
        </Content>
      </Layout>
    </div>
  );
}

export default App;
