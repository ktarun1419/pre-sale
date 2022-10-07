import React, { useState, useEffect } from "react";
import ConnectButton from "../helper/ConnectButton";
import Buy from "./Buy";
import { useWeb3React } from "@web3-react/core";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Countdown from "react-countdown";
import { countdowntime } from "../hooks/constant";

export default function Main() {
  const context = useWeb3React();
  const { account } = context;
  const [referrallink, setReferrallink] = useState(
    "Please connect your wallet first (Metamask/Trustwallet)"
  );
  const [refcopy, setRefcopy] = useState(false);
  // const [addrcopy, setAddrcopy] = useState(false);
  let base_url = `${window.location.href}?ref=`;

  useEffect(() => {
    if (account) {
      setReferrallink(`${base_url}${account}`);
    } else {
      setReferrallink("Please connect your wallet first (Metamask/Trustwallet");
    }
  }, [account, base_url]);

  const whitelistcountdown = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return (
        <ul className="app-timer js-app-timer grid">
          <li className="app-timer__item">
            <span className="app-timer__value js-timer-days">0</span>
            <h3 className="app-timer__title">Days</h3>
          </li>
          <li className="app-timer__item">
            <span className="app-timer__value js-timer-hours">0</span>
            <h3 className="app-timer__title">Hours</h3>
          </li>
          <li className="app-timer__item">
            <span className="app-timer__value js-timer-minutes">0</span>
            <h3 className="app-timer__title">Minutes</h3>
          </li>
          <li className="app-timer__item">
            <span className="app-timer__value js-timer-seconds">0</span>
            <h3 className="app-timer__title">Seconds</h3>
          </li>
        </ul>
      );
    } else {
      // Render a countdown
      return (
        <ul className="app-timer js-app-timer grid">
          <li className="app-timer__item">
            <span className="app-timer__value js-timer-days">{days}</span>
            <h3 className="app-timer__title">Days</h3>
          </li>
          <li className="app-timer__item">
            <span className="app-timer__value js-timer-hours">{hours}</span>
            <h3 className="app-timer__title">Hours</h3>
          </li>
          <li className="app-timer__item">
            <span className="app-timer__value js-timer-minutes">{minutes}</span>
            <h3 className="app-timer__title">Minutes</h3>
          </li>
          <li className="app-timer__item">
            <span className="app-timer__value js-timer-seconds">{seconds}</span>
            <h3 className="app-timer__title">Seconds</h3>
          </li>
        </ul>
      );
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <a href="#" className="navbar-brand">
            <img
              src="../images/logoxqzolive.png"
              alt="coin-67"
              style={{ width: "124px", height: "auto" }}
            />
          </a>
        </div>
      </nav>

      <main className="main mt-4">
        <section className="app section">
          <div className="app-container container flex flex--column">
            <div className="app__data-container flex flex--column">
              <ConnectButton />
            </div>
            <div className="app__data-wrapper grid">
              <div className="app__data-container flex flex--column">
                <h2 className="app__title">TOTAL TOKEN SALE</h2>
                <div className="app__data-content">
                  <div className="app__value">
                    <span className="saleqty">40000000</span>{" "}
                    <span className="tokenSymbol">XQZ</span>
                  </div>
                </div>
              </div>
              <div className="app__data-container flex flex--column">
                <h2 className="app__title">PRICE PER TOKEN</h2>
                <div className="app__data-content">
                  <div className="app__value">
                    1 USD = <span className="rate">10</span>{" "}
                    <span className="tokenSymbol">$XQZ</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="app__data-wrapper grid"></div>
            {/* <div className="app__data-container flex flex--column">
              <h2 className="app__title mb-0">
                Airdrops will be on Pulse-Chain
              </h2>

            </div> */}
            <div className="app__data-container flex flex--column">
              {/* <Countdown
                key={Math.floor(Math.random() * 10 + 1)}
                date={countdowntime}
                renderer={whitelistcountdown}
              /> */}
              {/* <h2 className="app__title mb-0">
                Alternative Coins Eth, Avax, Matic, Fantom Etc, can be sent to
                the wallet address
              </h2>
              <CopyToClipboard text="0x6043c59C77f6bdd6fED7130cA68aBB4Dc1Fe88E2" onCopy={() => {setAddrcopy(true);
                                                                setTimeout(()=>{
                                                                  setAddrcopy(false);
                                                                },2000)}}>
                <div className="token-app btn">
                  0x6043c59C77f6bdd6fED7130cA68aBB4Dc1Fe88E2
                </div>
              </CopyToClipboard>
              {addrcopy && <span className="text-center">copied</span>} */}
            </div>
            <div className="app__data-container flex flex--column">
              <h1 className="text-center mb-5" style={{ color: "#fff" }}>
                Buy Token
              </h1>
              <Buy />
            </div>
          </div>
        </section>
        <section className="app section">
          <div
            className="app-container container flex flex--column"
            style={{ marginTop: "5px!important" }}
          >
            <div
              style={{ textAlign: "center" }}
              className="app__data-container flex flex--column"
            >
              <h1 className="">
                Share the Love and get paid
                <br /> instantly in $$$$
              </h1>
              <span>
                Share your referral link and get paid instantly to your wallet
                for every referred token purchase.
              </span>
              <br />
              <p>referral commission 5%</p>
              <br />
              <p>
                Share your referral link or QR code and get commission for
                referred token purchases instantly to your wallet.
              </p>
              <br />
              <p>
                <input
                  type="text"
                  id="referLink"
                  value={referrallink}
                  readOnly={true}
                />
              </p>
              <CopyToClipboard
                text={`${base_url}${account}`}
                onCopy={() => {
                  setRefcopy(true);
                  setTimeout(() => {
                    setRefcopy(false);
                  }, 2000);
                }}
              >
                <button className="btn" id="copyreflink">
                  Copy
                </button>
              </CopyToClipboard>
              <span>{refcopy && "copied"}</span>
              <p id="refErr" className="err" style={{ display: "none" }}>
                Please connect your wallet on Binance Smart Chain to generate
                your referral link!
              </p>
            </div>
          </div>
        </section>

        <footer
          class="page-footer font-small cyan darken-3 text-center"
          style={{ backgroundColor: "#041934" }}
        >
          {/* <!-- Footer Elements --> */}
          <div class="container">
            {/* <!-- Grid row--> */}
            <div class="row">
              {/* <!-- Grid column --> */}
              <div class="col-md-12">
                <div class="mb-2 mt-5 flex-center">
                  {/* <!-- Twitter --> */}

                  <a href="#" class="tw-ic">
                    <i class="fab fa-telegram fa-lg white-text mr-md-5 mr-3 fa-2x">
                      {" "}
                    </i>
                  </a>

                  <a href="#" class="tw-ic">
                    <i class="fab fa-discord fa-lg white-text mr-md-5 mr-3 fa-2x">
                      {" "}
                    </i>
                  </a>
                  <a href="#" class="tw-ic">
                    <i class="fab fa-twitter fa-lg white-text mr-md-5 mr-3 fa-2x">
                      {" "}
                    </i>
                  </a>
                </div>
              </div>
              {/* <!-- Grid column --> */}
            </div>
            {/* <!-- Grid row--> */}
          </div>
          {/* <!-- Footer Elements --> */}

          {/* <!-- Copyright --> */}
          <div class="footer-copyright text-center py-3">
            © All Rights Reserved
          </div>
          {/* <!-- Copyright --> */}
        </footer>
      </main>
    </div>
  );
}
