const { expect } = require("chai");

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Staker&ExampleExternalContract", function () {
  async function deployTwoContract() {
    const ExampleYourToken = await hre.ethers.getContractFactory("YourToken");
    const exampleYourToken = await ExampleYourToken.deploy();
  
    await exampleYourToken.deployed();
  
    console.log("YourToken deployed to:", exampleYourToken.address);
  
    const ExampleVendor = await hre.ethers.getContractFactory("Vendor");
    const exampleVendor = await ExampleVendor.deploy(exampleYourToken.address);
  
    await exampleVendor.deployed();
    console.log("Vendor deployed to:", exampleVendor.address);
  
    const [addr1, addr2] = await ethers.getSigners();
    console.log('------------------------------------------')
    return { exampleYourToken,exampleVendor, addr1, addr2 };
  }

  it("should be able to allow Approve the owner contract YourToken to smart contract Vendor", async function () {
    console.log('------------------------------------------')

    const {exampleYourToken,exampleVendor, addr1, addr2 } = await loadFixture(deployTwoContract);
    const amount = 100;
    const owner=await exampleYourToken.getOwner();
    await exampleVendor.connect(addr1).allowApprove(amount);
    // const z=;
    expect(await exampleYourToken.allowance(owner,exampleVendor.address)).to.equal(amount);
  });

  it("should be able to buy Tokens ", async function () {
    console.log('------------------------------------------')
    const {exampleYourToken,exampleVendor, addr1, addr2 } = await loadFixture(deployTwoContract);
    const amount = 100;
    await exampleVendor.connect(addr1).allowApprove(amount);

    const oneEther = ethers.utils.parseEther( "0.11" );
    console.log("oneEther : "+ oneEther);
    await expect(exampleVendor.connect(addr2).buyTokens(5, {value:oneEther}))
    .to.emit(exampleVendor, "BuyTokens")
    .withArgs(addr2.address,oneEther , 5);

  });

  it("should be able to withdraw ether  to owner", async function () {
    console.log('------------------------------------------')
    const {exampleYourToken,exampleVendor, addr1, addr2 } = await loadFixture(deployTwoContract);
    const amount = 100;
    await exampleVendor.connect(addr1).allowApprove(amount);
    const oneEther = ethers.utils.parseEther( "0.11" );
    console.log("oneEther : "+ oneEther);
    await exampleVendor.connect(addr2).buyTokens(5, {value:oneEther})
    await exampleVendor.withdraw();
    expect(await exampleVendor.getFee()).to.equal(0);
  });

  it("should be able to withdraw ether  to owner", async function () {
    console.log('------------------------------------------')
    const {exampleYourToken,exampleVendor, addr1, addr2 } = await loadFixture(deployTwoContract);
    const amount = 100;
    await exampleVendor.connect(addr1).allowApprove(amount);
    const oneEther = ethers.utils.parseEther( "0.11" );
    console.log("oneEther : "+ oneEther);
    await exampleVendor.connect(addr2).buyTokens(5, {value:oneEther})
    await exampleVendor.withdraw();
    expect(await exampleVendor.getFee()).to.equal(0);
  });

  it("should be able to sell Tokens ether to owner", async function () {
    console.log('------------------------------------------')
    const {exampleYourToken,exampleVendor, addr1, addr2 } = await loadFixture(deployTwoContract);
    const amount = 100;
    await exampleVendor.connect(addr1).allowApprove(amount);
    const oneEther = ethers.utils.parseEther( "0.11" );
    console.log("oneEther : "+ oneEther);
    await exampleVendor.connect(addr2).buyTokens(5, {value:oneEther})
    expect(await exampleYourToken.balanceOf(addr2.address)).to.equal(5);

    await exampleVendor.connect(addr2).sellTokens(5);
    expect(await exampleYourToken.balanceOf(addr2.address)).to.equal(0);

  });


});
















// describe("NftERC721", function () {
//   it("Should be able to mint an NFT", async function () {
//     const ContractNftERC721 = await ethers.getContractFactory("NftERC721");
//     const [addr1, addr2] = await ethers.getSigners();

//     const hardhatNftERC721 = await ContractNftERC721.deploy("Darya", "DRY");
//     await hardhatNftERC721.deployed();
//     console.log(hardhatNftERC721.address)

//     const startingBalance = await hardhatNftERC721.balanceOf(addr1.address);

//     await hardhatNftERC721.connect(addr1).mint("https://gateway.pinata.cloud/ipfs/QmZ4fJuVxq2uLab53HH3WD6irhP8h6yC5Qjf6mgrf9oS38")
//     const newBalance = await hardhatNftERC721.balanceOf(addr1.address);
//     expect(newBalance).to.equal(startingBalance.add(1));
//   });

// });















