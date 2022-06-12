import { useEffect, useRef, useState } from "react";
import type { NextPage } from "next";
import { Web3Provider } from "@ethersproject/providers";
import { useViewerConnection } from "@self.id/react";
import { EthereumAuthProvider } from "@self.id/web";
import Web3Modal from "web3modal";
import styles from "../styles/Home.module.css";
import RecordSetter from "../components/record-setter";

const Home: NextPage = () => {
  const [connection, connect, disconnect] = useViewerConnection();
  const web3Modal: any = useRef();

  const getProvider = async () => {
    const provider = await web3Modal.current.connect();
    const WrappedWeb3Provider = new Web3Provider(provider);
    return WrappedWeb3Provider;
  };

  useEffect(() => {
    if (connection.status !== "connected") {
      web3Modal.current = new Web3Modal({
        network: "rinkeby",
        disableInjectedProvider: false,
        providerOptions: {},
      });
    }
  }, [connection.status]);

  const getEthereumAuthProvider = async () => {
    const wrappedProvider = await getProvider();
    const signer = wrappedProvider.getSigner();
    const address = await signer.getAddress();
    return new EthereumAuthProvider(wrappedProvider.provider, address);
  };

  const connectToSelfID = async () => {
    try {
      const ethereumAuthProvider = await getEthereumAuthProvider();
      connect(ethereumAuthProvider);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.navbar}>
        <span className={styles.title}>Ceramic Demo</span>
        {connection.status === "connected" ? (
          <span className={styles.subtitle}>Connected</span>
        ) : (
          <button
            onClick={connectToSelfID}
            className={styles.button}
            disabled={connection.status === "connecting"}
          >
            Connect
          </button>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.connection}>
          {connection.status === "connected" ? (
            <div>
              <span className={styles.subtitle}>
                Your 3ID is {connection.selfID.id}
              </span>
              <RecordSetter />
            </div>
          ) : (
            <span className={styles.subtitle}>
              Connect with your wallet to access your 3ID
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
