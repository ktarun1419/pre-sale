import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import * as contractfile from "../helper/contractData";
import { toast } from "react-toastify";
import Button from "react-bootstrap-button-loader";
import * as constdata from "../hooks/constant";
import { parseUnits } from "@ethersproject/units";
import { AddressZero } from "@ethersproject/constants";

export default function Buy() {
  const context = useWeb3React();
  const { account, library } = context;
  const [loading, setLoading] = useState(false);
  const [isApprove, setIsApprove] = useState(true);
  const [paymenttype, setPaymenttype] = useState(false);
  const [busdapprove, setBusdapprove] = useState(false);
  const [usdtapprove, setUsdtapprove] = useState(false);
  const [userbal, setUserBal] = useState(0);
  const [refresh, setRefresh] = useState(new Date());

  const [amount, setAmount] = useState("0.0");
  const [token, setToken] = useState("0.0");
  const [error_msg, setError_msg] = useState("");

  useEffect(() => {
    async function checkApprove() {
      try {
        if (account) {
          let busdconatrct = await contractfile.getBusdContract();
          let usdtconatrct = await contractfile.getUsdtContract();

          let busdcheck = await contractfile.checkApprove(
            busdconatrct,
            account
          );
          let usdtcheck = await contractfile.checkApprove(
            usdtconatrct,
            account
          );

          if (parseFloat(busdcheck) > 10000) {
            setBusdapprove(true);
          }

          if (parseFloat(usdtcheck) > 10000) {
            setUsdtapprove(true);
          }
        }
      } catch (err) {
        console.log(err.message);
      }
    }

    checkApprove();
  }, [account]);

  useEffect(() => {
    async function getUserBal() {
      if (account) {
        let contract = await contractfile.getContract();
        let userB = await contract.ikeBalance(account);
        userB = userB.toString() / Math.pow(10, 18);
        setUserBal(
          new Intl.NumberFormat("ja-JP", {
            maximumSignificantDigits: 3,
          }).format(userB)
        );
      }
    }

    getUserBal();
  }, [refresh, account]);

  const handlePaymentChange = async (e) => {
    setPaymenttype(e.target.value);

    if (e.target.value === "1") {
      if (usdtapprove === true) {
        setIsApprove(true);
      } else {
        setIsApprove(false);
      }
    } else {
      if (busdapprove === true) {
        setIsApprove(true);
      } else {
        setIsApprove(false);
      }
    }
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);

    if (isNaN(e.target.value)) {
      setToken(0);
      setError_msg("(please enter valid amount.)");
      return;
    } else if (parseFloat(e.target.value) === 0) {
      setToken(0);
      setError_msg("(please enter valid amount.)");
      return;
    } else if (parseFloat(e.target.value) < constdata.minInvest) {
      setError_msg(`amount must be greater ${constdata.minInvest} USD`);
      setToken(0);
      return;
    } else {
      setError_msg("");
      setToken(parseFloat((e.target.value * constdata.tokenPerUSD).toFixed(3)));
    }
  };

  const handleBuynow = async (e) => {
    try {
      setLoading(true);
      if (account) {
        if (
          (paymenttype === "1" || paymenttype === "2") &&
          !isNaN(amount) &&
          amount > 0
        ) {
          let check_balance = await contractfile.checkBalance(
            account,
            paymenttype
          );
          if (parseFloat(check_balance) >= parseFloat(amount)) {
            let addr = AddressZero;

            if (window.location.href.includes("?ref=")) {
              addr = window.location.href.substring(
                window.location.href.indexOf("=") + 1
              );
            }
            let contract = await contractfile.getContract(library);
            let value = parseUnits(amount);
            let tx = await contract.buy(paymenttype, addr, value);
            let response = await tx.wait();
            if (response) {
              if (response.status === 1) {
                toast.success(
                  "success ! Your Last Transaction is Successfull."
                );
                setLoading(false);
                setIsApprove(true);
                setRefresh(new Date());
                window.location.reload();
              } else if (response.status === 0) {
                toast.error("error ! Your Last Transaction is Failed.");
                setLoading(false);
                window.location.reload();
                setRefresh(new Date());
              } else {
                toast.error("error ! something went wrong.");
                setLoading(false);
                window.location.reload();
                setRefresh(new Date());
              }
            } else {
              toast.error("Opps ! something went wrong!");
              setLoading(false);
              window.location.reload();
            }
          } else {
            toast.error("you don't have sufficient funds in your account ");
            setLoading(false);
          }
        } else {
          toast.error("Please enter valid details ! try again");
          setLoading(false);
        }
      } else {
        toast.error("Please Connect Wallet !");
        setLoading(false);
      }
    } catch (err) {
      typeof err.data !== "undefined"
        ? toast.error(err.data.message)
        : toast.error(err.message);
      setLoading(false);
    }
  };

  const handleApproveToken = async (e) => {
    try {
      setLoading(true);
      if (account) {
        if (paymenttype) {
          let contract;
          if (paymenttype === "1") {
            contract = await contractfile.getUsdtContract(library);
          } else if (paymenttype === "2") {
            contract = await contractfile.getBusdContract(library);
          } else {
            toast.error("something went wrong ! please try again later");
            setLoading(false);
            return false;
          }
          let amount = parseUnits("10000000000000000000000000000000000");
          let tx = await contract.approve(constdata.presale_address, amount);
          let response = await tx.wait();
          if (response) {
            if (response.status === 1) {
              toast.success("success ! Your Last Transaction is Successfull.");
              setLoading(false);
              setIsApprove(true);
            } else if (response.status === 0) {
              toast.error("error ! Your Last Transaction is Failed.");
              setLoading(false);
            } else {
              toast.error("error ! something went wrong.");
              setLoading(false);
            }
          } else {
            toast.error("Opps ! something went wrong!");
            setLoading(false);
          }
        } else {
          toast.error("Please select payment type !");
          setLoading(false);
        }
      } else {
        toast.error("Please Connect Wallet !");
        setLoading(false);
      }
    } catch (err) {
      typeof err.data !== "undefined"
        ? toast.error(err.data.message)
        : toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="app-trade">
        <div className="app-trade__items grid">
          <div className="app-trade__item flex">
            <div className="app-trade__item-input">
              <div className="app-trade__token">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    onChange={(e) => handlePaymentChange(e)}
                    id="inlineRadio1"
                    value="1"
                  />
                  <label className="form-check-label" htmlFor="inlineRadio1">
                    <img src="../images/tether.png" alt="bnb-logo" />
                    USDT
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    onChange={(e) => handlePaymentChange(e)}
                    id="inlineRadio2"
                    value="2"
                  />
                  <label className="form-check-label" htmlFor="inlineRadio2">
                    <img src="../images/binance.png" alt="bnb-logo" />
                    BUSD
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    onChange={(e) => handlePaymentChange(e)}
                    id="inlineRadio2"
                    value="3"
                  />
                  <label className="form-check-label" htmlFor="inlineRadio2">
                    <img src="../images/bnb-logo.png" alt="bnb-logo" />
                    BNB
                  </label>
                </div>
              </div>
              {/* <input
                type="text"
                style={{ border: "1px solid", width: "80%" }}
                onChange={handleAmountChange}
                value={amount}
                className="app-trade__item-value"
                placeholder="0.0"
              />*/}
              <p>0.0</p>
              <div className="click-box">
                <div className="lbl">Click here</div>
                <div className="tag">(Live BNB TO USD)</div>
              </div>
            </div>
          </div>
          <div className="app-trade__item flex">
            <div className="app-trade__item-info flex flex--column">
              <h3 className="app-trade__token">
                <img src="../images/logoxqzolive.png" alt="min-logo" />
                XQZ
              </h3>
              <p className="app-trade__balance">
                Balance <span id="myTokens">{userbal}</span> <br />
                XQZ{" "}
              </p>
            </div>
            <div className="app-trade__item-input">
              <div className="app-trade__item-value">
                <span id="get">{token}</span>
              </div>
            </div>
          </div>
          <small className="text-danger">{error_msg}</small>
        </div>
        {isApprove ? (
          <Button
            loading={loading}
            className="btn"
            style={{ textAlign: "center" }}
            onClick={handleBuynow}
          >
            Buy Now
          </Button>
        ) : (
          <Button
            loading={loading}
            className="btn"
            style={{ textAlign: "center" }}
            onClick={handleApproveToken}
          >
            Approve
          </Button>
        )}
      </div>
    </>
  );
}
