import React, { useState, useEffect } from "react";
import Web3 from "web3";
import myERC20ABI from "./myERC20ABI.json";
import { TwitterFollowButton } from "react-twitter-embed";

const MyComponent = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [myERC20Contract, setMyERC20Contract] = useState(null);

  const MY_TWITTER_HANDLE = "my_twitter_handle";
  const MY_TWITTER_USER_ID = "my_twitter_user_id";

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);
        } catch (error) {
          console.error(error);
        }
      } else if (window.web3) {
        const web3Instance = new Web3(window.web3.currentProvider);
        setWeb3(web3Instance);
      } else {
        console.log("No web3 provider detected");
      }
    };
    loadWeb3();
  }, []);

  useEffect(() => {
    if (web3) {
      const myERC20Instance = new web3.eth.Contract(
        myERC20ABI,
        "my_erc20_contract_address"
      );
      setMyERC20Contract(myERC20Instance);
    }
  }, [web3]);

  const checkFollowing = async () => {
    if (web3 && myERC20Contract) {
      const accounts = await web3.eth.getAccounts();
      const currentAccount = accounts[0];
      const twitterStatus = await fetch(
        `https://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=${MY_TWITTER_HANDLE}`
      ).then((response) => response.json());
      setIsFollowing(
        twitterStatus[0].followers_count > 0 &&
          twitterStatus[0].followers.findIndex(
            (follower) => follower.id_str === MY_TWITTER_USER_ID
          ) !== -1
      );
      if (isFollowing) {
        await myERC20Contract.methods.withdrawToken().send({ from: currentAccount });
      }
    }
  };

  return (
    <div>
      <TwitterFollowButton
        screenName={MY_TWITTER_HANDLE}
        showCount={false}
        onClick={checkFollowing}
      />
      {isFollowing && <p>You are eligible to receive a token!</p>}
    </div>
  );
};

export default MyComponent;
