// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import metacoin_artifacts from '../../build/contracts/MetaCoin.json'
import d3Asset_artifacts from '../../build/contracts/D3AssetRequest.json'
import d3Coin_artifacts from '../../build/contracts/D3Coin.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var MetaCoin = contract(metacoin_artifacts);

//D3 Abstraction
var d3Asset = contract(d3Asset_artifacts);
var d3Coin = contract(d3Coin_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var account1;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(web3.currentProvider);
    d3Asset.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.refreshBalance();
    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  refreshBalance: function() {
    var self = this;

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account, {from: account});
    }).then(function(value) {
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("<font color=\"red\">Error getting balance; see log.</font>");
    });
  },
  refreshBalance1: function() {
    var self = this;

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account1, {from: account1});
    }).then(function(value) {
      var balance_element1 = document.getElementById("balance1");
      balance_element1.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("<font color=\"red\">Error getting balance; see log.</font>");
    });
  },

  sendCoin: function() {
    var self = this;

    var amount = parseInt(document.getElementById("amount").value);
    var receiver = document.getElementById("receiver").value;

    this.setStatus("<font color=\"red\">Initiating transaction... (please wait)</font>");

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.sendCoin(receiver, amount, {from: account});
    }).then(function() {
      self.setStatus("<font color=\"red\">Transaction complete!</font>");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("<font color=\"red\">Error sending coin; see log.</font>");
    });
  },
  d3HealthContract: function() {
    var self = this;

    var amount = localStorage.getItem('valueOfDataAsset');
    var receiver = localStorage.getItem('specialistAddress');

    //var amount = parseInt(document.getElementById("amount").value);
    //var receiver = document.getElementById("receiver").value;

    this.setStatus("<font color=\"red\">Initiating transaction... (please wait)</font>");

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.sendCoin(receiver, amount, {from: account});
    }).then(function() {
      self.setStatus("<font color=\"red\">Transaction complete!</font>");
      self.refreshBalance();
      self.refreshBalance1();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("<font color=\"red\">Error sending coin; see log.</font>");
    });
  },
  setGeneralInfo:function(blnGenInfo){
    var self = this;
    console.log('setting generalInto');
    var d3a;

    d3Asset.deployed().then(function(instance){
      d3a=instance;
      return d3a.setGeneralInfo(blnGenInfo);
    }).then(function() {
      console.log('setGeneralInfo Complete!');
    }).catch(function(e) {
      console.log(e);
      self.setStatus("<font color=\"red\">Error in setGeneralInfo; see log.</font>");
    });
  },

  getGeneralInfo:function(){
    var self = this;
    console.log('getting generalInto');

    var d3a;

    d3Asset.deployed().then(function(instance){
      d3a=instance;
      return d3a.getGeneralInfo();
    }).then(function() {
      console.log('getGeneralInfo Complete!');
    }).catch(function(e) {
      console.log(e);
      self.setStatus("<font color=\"red\">Error in getGeneralInfo; see log.</font>");
    });
  }

};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
